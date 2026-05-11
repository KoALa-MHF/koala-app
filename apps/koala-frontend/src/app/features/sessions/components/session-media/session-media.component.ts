import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Media } from '../../../../graphql/generated/graphql';
import { MediaService, MediaUploadState } from '../../services/media.service';
import { FormGroup } from '@angular/forms';

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
  @Input() mediaForm!: FormGroup;
  @Output() fileUpload: EventEmitter<File> = new EventEmitter<File>();
  @Output() deleteMediaEvent: EventEmitter<void> = new EventEmitter<void>();

  mediaUploadStateChanged$ = this.mediaService.mediaUploadStateChanged$;
  MediaUploadState = MediaUploadState;

  constructor(private readonly mediaService: MediaService) {}

  get isFileActive(): boolean {
    return !!this.media && !!this.media.mimeType && !this.media.mimeType.startsWith('external');
  }

  get isUrlActive(): boolean {
    return !!this.media?.mimeType?.startsWith('external');
  }

  public onFileUpload(event: any, fileUploadElement: any) {
    this.fileUpload.emit(event.files[0]);

    fileUploadElement.clear();
  }

  public deleteMedia() {
    this.deleteMediaEvent.emit();
  }
}
