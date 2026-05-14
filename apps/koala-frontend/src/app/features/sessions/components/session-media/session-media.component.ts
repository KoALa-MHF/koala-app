import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Media } from '../../../../graphql/generated/graphql';
import { MediaService, MediaUploadState } from '../../services/media.service';
import { FormGroup } from '@angular/forms';
import { ConfirmationService } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';

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

  constructor(
    private readonly mediaService: MediaService,
    private readonly confirmationService: ConfirmationService,
    private readonly translateService: TranslateService
  ) {}

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
    this.confirmationService.confirm({
      header: this.translateService.instant('SESSION.MAINTAIN.AUDIO.DELETE_CONFIRM_DIALOG.TITLE'),
      message: this.translateService.instant('SESSION.MAINTAIN.AUDIO.DELETE_CONFIRM_DIALOG.EXPLANATION'),
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: this.translateService.instant('SESSION.MAINTAIN.AUDIO.DELETE_CONFIRM_DIALOG.CONFIRM_BTN'),
      rejectLabel: this.translateService.instant('SESSION.MAINTAIN.AUDIO.DELETE_CONFIRM_DIALOG.CANCEL_BTN'),
      accept: () => {
        this.deleteMediaEvent.emit();
      },
    });
  }
}
