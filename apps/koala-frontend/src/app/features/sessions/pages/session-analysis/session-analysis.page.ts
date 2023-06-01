import { ApplicationRef, Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../auth/services/auth.service';
import { MediaControlService, MediaEvent, MediaActions } from '../../services/media-control.service';
import { MessageService } from 'primeng/api';
import { SessionsService } from '../../services/sessions.service';
import { AnnotationService } from '../../services/annotation.service';
import { MarkerService } from '../../services/marker.service';
import { TranslateService } from '@ngx-translate/core';
import { DataPoint, Display } from '../../components/annotation/annotation.component';
import { Session } from '../../types/session.entity';
import { environment } from '../../../../../environments/environment';
import { Marker } from '../../types/marker.entity';
import { filter } from 'rxjs';

export interface AnnotationData {
  AnnotationData: Map<number, Array<DataPoint>>;
}

@Component({
  selector: 'koala-session-analysis',
  templateUrl: './session-analysis.page.html',
  styleUrls: [
    './session-analysis.page.scss',
  ],
  encapsulation: ViewEncapsulation.None,
})
export class SessionAnalysisPage implements OnInit, OnDestroy {
  mediaUri: string = environment.production ? 'https://koala-app.de/api/media' : 'http://localhost:4200/api/media';
  sessionId = 0;
  userID = -1;
  userSessionAnnotationData: Map<number, AnnotationData> = new Map<number, AnnotationData>();
  markers: Marker[] = [];
  session!: Session;
  waveContainer!: string;
  currentAudioTime = 0;
  totalAudioTime = 0;
  audioPaused = true;

  constructor(
    private readonly sessionService: SessionsService,
    private readonly annotationService: AnnotationService,
    private readonly markerService: MarkerService,
    private readonly authService: AuthService,
    private readonly route: ActivatedRoute,
    private readonly mediaControlService: MediaControlService,
    private readonly messageService: MessageService,
    private readonly translateService: TranslateService,
    private appRef: ApplicationRef
  ) {}

  async ngOnInit() {
    this.sessionId = parseInt(this.route.snapshot.paramMap.get('sessionId') || '0');
    this.authService.me().subscribe({
      next: (data) => {
        this.userID = parseInt(data.id);
      },
      error: (e) => {
        this.showErrorMessage(
          'error',
          'SESSION.ERROR_DIALOG.NO_USER_SESSION',
          'SESSION.ERROR_DIALOG.NO_USER_SESSION_SUM'
        );
        console.log(e);
      },
    });

    this.sessionService.getOne(this.sessionId).subscribe(async (result) => {
      this.session = {
        ...result,
        media: result.media,
      };

      if (this.session.media == undefined) {
        this.showErrorMessage('error', 'SESSION.ERROR_DIALOG.NO_AUDIO_FILE', 'SESSION.ERROR_DIALOG.NO_AUDIO_FILE_SUM');
        return;
      }

      this.mediaControlService.uuid = this.session.id;
      this.waveContainer = `waveContainer-${this.session.id}`;

      await this.loadMediaData(this.session.media.id);
      if (this.session.userSessions && this.session.userSessions.length > 0) {
        this.loadMarkerData();
        this.loadAnnotations(this.session.userSessions);
        this.appRef.tick();
        setTimeout(() => {
          //TODO: fix using separate component/service
          window.dispatchEvent(new Event('resize'));
        }, 100);
      }
    });
  }

  ngOnDestroy(): void {
    this.mediaControlService.stop();
  }

  private loadMediaData(id: string): Promise<void> {
    return this.mediaControlService
      .load(`${this.mediaUri}/${id}`, this.waveContainer)
      .then(() => {
        this.mediaControlService.addEventHandler('audioprocess', (time) => {
          // to reduce update frequency
          this.currentAudioTime = time.toFixed(2);
        });

        this.mediaControlService.mediaPlayStateChanged$
          .pipe(filter((mediaAction) => mediaAction === MediaActions.Stop))
          .subscribe({
            next: () => {
              this.audioPaused = true;
            },
          });

        this.mediaControlService.mediaPlayStateChanged$
          .pipe(filter((mediaAction) => mediaAction === MediaActions.Play))
          .subscribe({
            next: () => {
              this.audioPaused = false;
            },
          });
        return new Promise<void>((resolve) => {
          this.mediaControlService.mediaPlayStateChanged$
            .pipe(filter((mediaAction) => mediaAction === MediaActions.Ready))
            .subscribe({
              next: () => {
                this.totalAudioTime = this.mediaControlService.getDuration();
                resolve();
              },
            });
        });
      })
      .catch((e) => {
        this.showErrorMessage('error', 'SESSION.ERROR_DIALOG.BROKEN_AUDIO_FILE', 'SESSION.ERROR_DIALOG.SUMMARY');
        console.log(e);
        return new Promise<void>((reject) => {
          reject();
        });
      });
  }

  private loadMarkerData(): void {
    const toolbars = this.session?.toolbars;
    if (toolbars) {
      const toolbar = toolbars[0];
      const toolbarMarkers = toolbar?.markers || [];
      const markerIds: Array<number> = toolbarMarkers.map((marker) => parseInt(marker.markerId));
      this.markerService.getAll(markerIds).subscribe((result) => {
        const markers = result.data?.markers;
        for (const marker of markers) {
          const toolbarMarker = toolbarMarkers.find((t) => parseInt(t.markerId) == marker.id);
          const m = { visible: toolbarMarker ? toolbarMarker.visible : true, ...marker };
          this.markers.push(m);
        }
        this.markers = [
          ...this.markers,
        ];
      });
    }
  }

  private loadAnnotations(userSessions: any[]): void {
    for (const userSessoin of userSessions) {
      this.userSessionAnnotationData.set(userSessoin.id, {
        AnnotationData: new Map<number, Array<DataPoint>>(),
      });
      for (const annotation of userSessoin.annotations) {
        if (this.userSessionAnnotationData.get(userSessoin.id)) {
          // eslint-disable-next-line  @typescript-eslint/no-non-null-assertion
          if (!this.userSessionAnnotationData.get(userSessoin.id)?.AnnotationData.get(annotation.marker.id)) {
            this.userSessionAnnotationData
              .get(userSessoin.id)
              ?.AnnotationData.set(annotation.marker.id, new Array<DataPoint>());
          }
          this.userSessionAnnotationData
            .get(userSessoin.id)
            ?.AnnotationData.get(annotation.marker.id)
            ?.push({
              id: annotation.id,
              startTime: annotation.start / 1000,
              endTime: annotation.end != null ? annotation.end / 1000 : 0,
              strength: annotation.value,
              display: annotation.end == null ? Display.Circle : Display.Rect,
              color: annotation.marker.color,
            });
        }
      }
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
}
