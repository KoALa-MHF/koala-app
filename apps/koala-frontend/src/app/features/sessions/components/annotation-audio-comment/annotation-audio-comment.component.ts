import { ChangeDetectorRef, Component, OnDestroy } from '@angular/core';
import { Subscription, timer } from 'rxjs';

@Component({
  selector: 'koala-annotation-audio-comment',
  templateUrl: './annotation-audio-comment.component.html',
  styleUrls: [
    './annotation-audio-comment.component.css',
  ],
})
export class AnnotationAudioCommentComponent implements OnDestroy {
  mediaRecorder?: MediaRecorder;
  private chunks: Blob[] = [];

  audioSource = '';
  loading = false;
  recording = false;
  recordingTime = new Date('000000');
  recordingStartDate?: number;

  recordingTimerSubscription?: Subscription;

  constructor(private readonly ref: ChangeDetectorRef) {}

  onRecord(event: any) {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
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
            const blob = new Blob(this.chunks, { type: 'audio/ogg; codecs=opus' });
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
    }
  }

  onStop() {
    if (this.mediaRecorder) {
      this.mediaRecorder.stop();
      console.log(this.mediaRecorder.state);
    }
  }

  ngOnDestroy() {
    this.recordingTimerSubscription?.unsubscribe();
  }
}
