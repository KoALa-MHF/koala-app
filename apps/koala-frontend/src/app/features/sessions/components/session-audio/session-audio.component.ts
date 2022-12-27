import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Media } from 'apps/koala-frontend/src/app/graphql/generated/graphql';

@Component({
  selector: 'koala-session-audio',
  templateUrl: './session-audio.component.html',
  styleUrls: [
    './session-audio.component.scss',
    '../../session-common.scss',
  ],
})
export class SessionAudioComponent implements OnInit {
  @Input() media: Media | null | undefined;
  @Output() fileUpload: EventEmitter<File> = new EventEmitter<File>();

  constructor() {}

  ngOnInit(): void {}

  public onFileUpload(event: any) {
    this.fileUpload.emit(event.files[0]);
  }
}
