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
      // annotationId is bound before mediaId in the template, so it is already set here
      this.fetchAudioBlob(this.annotationId).then((audioUrl) => {
        this.annotationAudioSource = audioUrl;
      });
    }
  }
  @Input() editable = false;
  @Output() save = new EventEmitter<AnnotationAudioComment>();
  @Output() delete = new EventEmitter();

  apiUrl = environment.apiUrl;
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

  private async fetchAudioBlob(annotationId: number): Promise<string | undefined> {
    const response = await fetch(`${this.apiUrl}/annotations/${annotationId}/media`, {
      headers: {
        Authorization: `Bearer ${this.accessTokenService.getAccessToken()}`,
      },
    });

    // e.g. the file is missing, the error response must not be used as audio source
    if (!response.ok) {
      console.log(`Audio comment of annotation ${annotationId} could not be loaded: ${response.status}`);
      return undefined;
    }

    return window.URL.createObjectURL(await response.blob());
  }
}
