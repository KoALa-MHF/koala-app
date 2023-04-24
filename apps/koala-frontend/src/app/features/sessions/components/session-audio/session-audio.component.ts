import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Media } from '../../../../graphql/generated/graphql';

@Component({
  selector: 'koala-session-audio',
  templateUrl: './session-audio.component.html',
  styleUrls: [
    './session-audio.component.scss',
    '../../session-common.scss',
  ],
})
export class SessionAudioComponent {
  @Input() media: Media | null | undefined;
  @Output() fileUpload: EventEmitter<File> = new EventEmitter<File>();

  public onFileUpload(event: any) {
    this.fileUpload.emit(event.files[0]);
  }
}
