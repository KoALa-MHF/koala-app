import { Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { Subscription, timer } from 'rxjs';
import { DisplayMode } from '../../types/display-mode.enum';
import { MediaRecorderService } from '../../services/media-recorder.service';

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
  @Input() audioSrc = '';
  @Output() save = new EventEmitter<AnnotationAudioComment>();
  @Output() delete = new EventEmitter();

  //mediaRecorder?: MediaRecorder;
  //private chunks: Blob[] = [];

  audioSource = '';
  loading = false;
  recording = false;
  recordingTime = new Date('000000');
  recordingStartDate?: number;
  recordedBlob?: Blob;
  displayMode = DisplayMode.DISPLAY;

  DisplayMode = DisplayMode;

  recordingTimerSubscription?: Subscription;

  constructor(private readonly mediaRecorderService: MediaRecorderService) {}

  async onRecord() {
    this.loading = true;

    await this.mediaRecorderService.record();

    this.loading = false;
    this.recording = true;
    this.recordingStartDate = Date.now();

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

    const audioURL = window.URL.createObjectURL(this.recordedBlob);
    this.audioSource = audioURL;
  }

  onSave() {
    if (this.recordedBlob) {
      this.save.emit({
        annotationId: this.annotationId,
        comment: this.recordedBlob,
      });
    }
  }

  onCancel() {}

  onDelete() {}

  ngOnDestroy() {
    this.recordingTimerSubscription?.unsubscribe();
  }
}
