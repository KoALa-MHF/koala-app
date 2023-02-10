import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MarkerService } from '../../services/marker.service';
import { MessageService } from 'primeng/api';
import { MediaControlService, MediaEvent, MediaActions } from '../../services/media-control.service';
import { SessionsService } from '../../services/sessions.service';
import { environment } from '../../../../../environments/environment';
import { Session } from '../../types/session.entity';

@Component({
  selector: 'koala-app-session',
  templateUrl: './session.page.html',
  styleUrls: [
    './session.page.scss',
  ],
})
export class SessionPage implements OnInit {
  maintainSessionForm!: FormGroup;
  maintainMarkerForm!: FormGroup;
  waveContainer!: string;
  mediaUri: string = environment.production ? 'https://koala-app.de/api/media' : 'http://localhost:4200/api/media';
  sessionId = 0;
  session!: Session;
  participants: any = [];

  constructor(
    private readonly sessionService: SessionsService,
    private readonly markerService: MarkerService,
    private readonly route: ActivatedRoute,
    private mediaControlService: MediaControlService,
    private readonly messageService: MessageService,
    private readonly translateService: TranslateService
  ) {}

  ngOnInit(): void {
    this.sessionId = parseInt(this.route.snapshot.paramMap.get('sessionId') || '0');
    this.sessionService.getOne(this.sessionId).subscribe((result) => {
      this.session = {
        ...result.data?.session,
        media: result.data?.session.media,
      };
      if (this.session.media == undefined) {
        this.showErrorMessage('error', 'SESSION.ERROR_DIALOG.NO_AUDIO_FILE', 'SESSION.ERROR_DIALOG.NO_AUDIO_FILE_SUM');
        return;
      }
      this.mediaControlService.uuid = this.session.id;
      this.waveContainer = `waveContainer-${this.session.id}`;
      try {
        this.mediaControlService.load(`${this.mediaUri}/${this.session.id}`, this.waveContainer);
      } catch (e) {
        this.showErrorMessage('error', 'SESSION.ERROR_DIALOG.BROKEN_AUDIO_FILE', 'SESSION.ERROR_DIALOG.SUMMARY');
        console.log(e);
      }
    });
  }

  getAudioMetadata() {
    try {
      const m = this.mediaControlService.getMetadata();
      return m;
    } catch (error) {
      return undefined;
    }
  }

  onMediaEvent(evt: MediaEvent) {
    switch (evt.actions) {
      case MediaActions.Play:
        try {
          this.mediaControlService.togglePlay();
        } catch (error) {
          this.showErrorMessage('error', 'SESSION.ERROR_DIALOG.MEDIA_CONTROLS', 'SESSION.ERROR_DIALOG.ERRORS.SUMMARY');
        }
        break;
      case MediaActions.Stop:
        try {
          this.mediaControlService.stop();
        } catch (error) {
          this.showErrorMessage('error', 'SESSION.ERROR_DIALOG.MEDIA_CONTROLS', 'SESSION.ERROR_DIALOG.ERRORS.SUMMARY');
        }
        break;
      case MediaActions.SkipForward:
        try {
          this.mediaControlService.skipForward();
        } catch (error) {
          this.showErrorMessage('error', 'SESSION.ERROR_DIALOG.MEDIA_CONTROLS', 'SESSION.ERROR_DIALOG.ERRORS.SUMMARY');
        }
        break;
      case MediaActions.SkipBackward:
        try {
          this.mediaControlService.skipBackward();
        } catch (error) {
          this.showErrorMessage('error', 'SESSION.ERROR_DIALOG.MEDIA_CONTROLS', 'SESSION.ERROR_DIALOG.ERRORS.SUMMARY');
        }
        break;
      case MediaActions.VolumeChange:
        if (evt.value != undefined) {
          try {
            this.mediaControlService.onVolumeChange(evt.value);
          } catch (error) {
            this.showErrorMessage(
              'error',
              'SESSION.ERROR_DIALOG.MEDIA_CONTROLS',
              'SESSION.ERROR_DIALOG.ERRORS.SUMMARY'
            );
          }
        }
        break;
    }
  }

  private showErrorMessage(severity: string, detail: string, sum: string) {
    this.translateService
      .get([
        detail,
        sum,
      ])
      .subscribe((results: Record<string, string>) => {
        this.messageService.add({
          severity: severity,
          summary: results[sum],
          detail: results[detail],
        });
      });
  }
}
