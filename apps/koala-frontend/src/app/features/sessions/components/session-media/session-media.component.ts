import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Media } from '../../../../graphql/generated/graphql';
import { MediaService, MediaUploadState } from '../../services/media.service';

@Component({
  selector: 'koala-session-media',
  templateUrl: './session-media.component.html',
  styleUrls: [
    './session-media.component.scss',
    '../../session-common.scss',
  ],
})
export class SessionMediaComponent {
  @Input() media: Media | null | undefined;
  @Output() fileUpload: EventEmitter<File> = new EventEmitter<File>();
  @Output() deleteMediaEvent: EventEmitter<void> = new EventEmitter<void>();

  mediaUploadStateChanged$ = this.mediaService.mediaUploadStateChanged$;
  MediaUploadState = MediaUploadState;

  constructor(private readonly mediaService: MediaService) {}

  public onFileUpload(event: any, fileUploadElement: any) {
    this.fileUpload.emit(event.files[0]);

    fileUploadElement.clear();
  }

  public deleteMedia() {
    this.deleteMediaEvent.emit();
  }
}
