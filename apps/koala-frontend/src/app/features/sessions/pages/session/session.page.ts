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
import { DataPoint, Display } from '../../components/annotation/annotation.component';

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
  AnnotationData: Map<number, Array<DataPoint>> = new Map<number, Array<DataPoint>>();
  AnnotationDislay = Display;
  sliderValueGreen = 0;
  sliderValueLila = 0;

  currentAudioTime = 0;
  totalAudioTime = 0;
  audioPaused = true;

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
        this.mediaControlService.load(`${this.mediaUri}/${this.session.id}`, this.waveContainer).then(() => {
          this.mediaControlService.addEventHandler('audioprocess', (time) => {
            this.currentAudioTime = time;
          });
          this.mediaControlService.addEventHandler('ready', () => {
            this.totalAudioTime = this.mediaControlService.getDuration();
          });
          this.mediaControlService.addEventHandler('pause', () => {
            this.audioPaused = true;
          });
          this.mediaControlService.addEventHandler('play', () => {
            this.audioPaused = false;
          });
        });
      } catch (e) {
        this.showErrorMessage('error', 'SESSION.ERROR_DIALOG.BROKEN_AUDIO_FILE', 'SESSION.ERROR_DIALOG.SUMMARY');
        console.log(e);
      }
    });
  }

  getAudioMetadata() {
    try {
      return this.mediaControlService.getMetadata();
    } catch (error) {
      return undefined;
    }
  }

  annotationClick(row: number, color: string, display: Display) {
    if (this.audioPaused) {
      return;
    }
    const t = this.mediaControlService.getCurrentTime();
    if (this.AnnotationData.get(row) == undefined) {
      this.AnnotationData.set(row, new Array<DataPoint>());
    }
    this.AnnotationData.get(row)?.push({ startTime: t, endTime: t, strength: 3, id: 1, color: color, disply: display });
  }

  annotationSliderChange(event: any, row: number, color: string, display: Display) {
    if (this.audioPaused) {
      return;
    }
    const t = this.mediaControlService.getCurrentTime();
    const annotation = this.AnnotationData.get(row);
    if (annotation == undefined) {
      this.AnnotationData.set(row, new Array<DataPoint>());
      this.AnnotationData.get(row)?.push({
        startTime: t,
        endTime: 0,
        strength: event.value,
        id: 1,
        color: color,
        disply: display,
      });
      return;
    }
    const latest = annotation.at(-1);
    if (latest && latest.strength != event.value) {
      if (latest.endTime == 0) {
        latest.endTime = t;
      }
      if (event.value != 0) {
        annotation.push({
          startTime: t,
          endTime: 0,
          strength: event.value,
          id: annotation.length,
          color: color,
          disply: display,
        });
      }
      this.AnnotationData.set(row, annotation);
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
      case MediaActions.Mute:
        if (evt.value != undefined) {
          try {
            this.mediaControlService.onMute(evt.value);
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
