import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Media } from '../../../../graphql/generated/graphql';
import { MediaService, MediaUploadState } from '../../services/media.service';

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

  mediaUploadStateChanged$ = this.mediaService.mediaUploadStateChanged$;
  MediaUploadState = MediaUploadState;

  constructor(private readonly mediaService: MediaService) {}

  public onFileUpload(event: any, fileUploadElement: any) {
    this.fileUpload.emit(event.files[0]);

    fileUploadElement.clear();
  }
}
