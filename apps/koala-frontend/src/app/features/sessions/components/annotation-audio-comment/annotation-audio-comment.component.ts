import { Component, EventEmitter, OnDestroy, Output } from '@angular/core';
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

    /*if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      this.loading = true;
      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then((stream) => {
          this.mediaRecorder = new MediaRecorder(stream);

          this.mediaRecorder.onstart = () => {
            this.loading = false;
            this.recording = true;

            this.ref.detectChanges();

            this.recordingStartDate = Date.now();

            this.recordingTimerSubscription = timer(1000, 1000).subscribe(() => {
              if (this.recordingStartDate) {
                this.recordingTime = new Date(Date.now() - this.recordingStartDate);
                this.ref.detectChanges();
              }
            });
          };
          this.mediaRecorder.ondataavailable = (e) => {
            this.chunks.push(e.data);
          };
          this.mediaRecorder.onstop = () => {
            this.recording = false;
            this.recordingTimerSubscription?.unsubscribe();
            const blob = this.createBlobFromChunks();
            this.chunks = [];
            const audioURL = window.URL.createObjectURL(blob);
            this.audioSource = audioURL;

            this.ref.detectChanges();

            stream.getTracks().forEach((track) => track.stop());
          };

          this.mediaRecorder.start();
        })
        .catch((err) => {
          this.loading = false;
          console.error(`The following getUserMedia error occurred: ${err}`);
        });
    } else {
      console.log('getUserMedia not supported on your browser!');
    }*/
  }

  async onStop() {
    this.recordedBlob = await this.mediaRecorderService.stop();
    this.recording = false;
    this.recordingTimerSubscription?.unsubscribe();

    const audioURL = window.URL.createObjectURL(this.recordedBlob);
    this.audioSource = audioURL;

    /*if (this.mediaRecorder) {
      this.mediaRecorder.stop();
      console.log(this.mediaRecorder.state);
    }*/
  }

  onSave() {
    if (this.recordedBlob) {
      this.save.emit({
        annotationId: 0,
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
