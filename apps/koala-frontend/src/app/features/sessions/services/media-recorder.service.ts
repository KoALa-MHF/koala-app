import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class MediaRecorderService {
  mediaRecorder?: MediaRecorder;
  private chunks: Blob[] = [];
  private stream?: MediaStream;

  record(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        this.chunks = [];
        navigator.mediaDevices
          .getUserMedia({ audio: true })
          .then((stream) => {
            this.stream = stream;
            this.mediaRecorder = new MediaRecorder(stream);

            this.mediaRecorder.onstart = () => {
              resolve();
            };
            this.mediaRecorder.ondataavailable = (e) => {
              this.chunks.push(e.data);
            };

            this.mediaRecorder.start();
          })
          .catch((err) => {
            console.error(`The following getUserMedia error occurred: ${err}`);
            reject();
          });
      } else {
        console.log('getUserMedia not supported on your browser!');
        reject();
      }
    });
  }

  stop(): Promise<Blob> {
    return new Promise((resolve, reject) => {
      if (this.mediaRecorder) {
        this.mediaRecorder.onstop = () => {
          this.stream?.getTracks().forEach((track) => track.stop());
          resolve(new Blob(this.chunks, { type: 'audio/mp3' }));
        };

        this.mediaRecorder.stop();
      }
    });
  }
}
