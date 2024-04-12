import { Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { Subscription, timer } from 'rxjs';
import { DisplayMode } from '../../types/display-mode.enum';
import { MediaRecorderService } from '../../services/media-recorder.service';
import { environment } from '../../../../../environments/environment';
import { AccessTokenService } from '../../../auth/services/access-token.service';

export interface AnnotationAudioComment {
  annotationId: number;
  comment: Blob;
}

@Component({
  selector: 'koala-annotation-audio-comment',
  templateUrl: './annotation-audio-comment.component.html',
  styleUrls: [
    './annotation-audio-comment.component.css',
  ],
})
export class AnnotationAudioCommentComponent implements OnDestroy {
  @Input() annotationId = 0;
  @Input() set mediaId(value: number) {
    delete this.recordedAudioSource;
    delete this.recordedBlob;
    delete this.annotationAudioSource;

    this._mediaId = value;

    if (value !== 0) {
      this.fetchAudioBlob(value).then((audioUrl) => {
        this.annotationAudioSource = audioUrl;
      });
    }
  }
  @Output() save = new EventEmitter<AnnotationAudioComment>();
  @Output() delete = new EventEmitter();

  mediaUrl = environment.mediaUrl;
  recordedAudioSource?: string;
  annotationAudioSource?: string;
  _mediaId = 0;
  loadingForRecordingService = false;
  recording = false;
  recordingTime = new Date('000000');
  recordingStartDate?: number;
  recordedBlob?: Blob;
  displayMode = DisplayMode.DISPLAY;

  DisplayMode = DisplayMode;

  recordingTimerSubscription?: Subscription;

  constructor(
    private readonly mediaRecorderService: MediaRecorderService,
    private readonly accessTokenService: AccessTokenService
  ) {}

  async onRecord() {
    this.loadingForRecordingService = true;

    await this.mediaRecorderService.record();

    this.loadingForRecordingService = false;
    this.recording = true;
    this.recordingStartDate = Date.now();
    this.recordingTime = new Date(Date.now() - this.recordingStartDate);

    this.recordingTimerSubscription = timer(1000, 1000).subscribe(() => {
      if (this.recordingStartDate) {
        this.recordingTime = new Date(Date.now() - this.recordingStartDate);
      }
    });
  }

  async onStop() {
    this.recordedBlob = await this.mediaRecorderService.stop();
    this.recording = false;
    this.recordingTimerSubscription?.unsubscribe();

    this.recordedAudioSource = window.URL.createObjectURL(this.recordedBlob);
  }

  onSave() {
    if (this.recordedBlob) {
      this.save.emit({
        annotationId: this.annotationId,
        comment: this.recordedBlob,
      });

      delete this.recordedBlob;
      delete this.annotationAudioSource;
    }
  }

  async onCancel() {
    delete this.recordedBlob;
    delete this.recordedAudioSource;
  }

  onDelete() {
    this.delete.emit();
  }

  ngOnDestroy() {
    this.recordingTimerSubscription?.unsubscribe();
  }

  reset() {
    this.onCancel();
  }

  private async fetchAudioBlob(mediaId: number): Promise<string> {
    const response = await fetch(`${this.mediaUrl}/${mediaId}`, {
      headers: {
        Authorization: `Bearer ${this.accessTokenService.getAccessToken()}`,
      },
    });

    return window.URL.createObjectURL(await response.blob());
  }
}
