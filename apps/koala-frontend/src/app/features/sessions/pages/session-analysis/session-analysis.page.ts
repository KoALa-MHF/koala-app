import { ApplicationRef, Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../auth/services/auth.service';
import { MediaControlService, MediaEvent, MediaActions } from '../../services/media-control.service';
import { MessageService } from 'primeng/api';
import { SessionsService } from '../../services/sessions.service';
import { AnnotationService } from '../../services/annotation.service';
import { MarkerService } from '../../../markers/services/marker.service';
import { TranslateService } from '@ngx-translate/core';
import { DataPoint, Display } from '../../components/annotation/annotation.component';
import { Session } from '../../types/session.entity';
import { environment } from '../../../../../environments/environment';
import { Marker } from '../../types/marker.entity';
import { filter } from 'rxjs';
import { NavigationService } from '../../services/navigation.service';
import { ToolbarsService } from '../../services/toolbars.service';
import { UserSession } from '../../types/user-session.entity';

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
  mediaUri: string = environment.production
    ? 'https://koala.mh-freiburg.de/api/media'
    : 'http://localhost:4200/api/media';
  sessionId = 0;
  userID = -1;
  userSessionAnnotationData: Map<number, AnnotationData> = new Map<number, AnnotationData>();
  markers: Marker[] = [];
  session!: Session;
  waveContainer!: string;
  currentAudioTime = 0;
  totalAudioTime = 0;
  audioPaused = true;

  sessionAnalysisSettingsToggled$ = this.navigationService.sessionAnalysisSettingsSidePanelToggled$;

  constructor(
    private readonly sessionService: SessionsService,
    private readonly annotationService: AnnotationService,
    private readonly markerService: MarkerService,
    private readonly authService: AuthService,
    private readonly route: ActivatedRoute,
    private readonly mediaControlService: MediaControlService,
    private readonly messageService: MessageService,
    private readonly toolbarService: ToolbarsService,
    private readonly translateService: TranslateService,
    private readonly navigationService: NavigationService,
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

    this.sessionService.setFocusSession(this.sessionId).subscribe(async (result) => {
      this.session = {
        ...result,
        media: result.media,
      };

      if (this.session.isAudioSession) {
        if (this.session.media == undefined) {
          this.showErrorMessage(
            'error',
            'SESSION.ERROR_DIALOG.NO_AUDIO_FILE',
            'SESSION.ERROR_DIALOG.NO_AUDIO_FILE_SUM'
          );
          return;
        }

        this.mediaControlService.uuid = this.session.id;
        this.waveContainer = `waveContainer-${this.session.id}`;

        await this.loadMediaData(this.session.media.id);
      } else {
        if (this.session.liveSessionStart && this.session.liveSessionEnd) {
          this.totalAudioTime =
            (new Date(this.session.liveSessionEnd).valueOf() - new Date(this.session.liveSessionStart).valueOf()) /
            1000;
        }
      }

      if (this.session.userSessions && this.session.userSessions.length > 0) {
        this.loadMarkerData(this.session.userSessions);
        this.appRef.tick();
        setTimeout(() => {
          //TODO: fix using separate component/service
          window.dispatchEvent(new Event('resize'));
        }, 100);
      }
    });
  }

  ngOnDestroy(): void {
    if (this.session.isAudioSession) {
      this.mediaControlService.stop();
      this.mediaControlService.destroy();
    }
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
                if (this.session.isAudioSession) {
                  this.totalAudioTime = this.mediaControlService.getDuration();
                }

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

  private loadMarkerData(userSessions: any): void {
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
        this.loadAnnotations(userSessions);
      });
    }
  }

  private loadAnnotations(userSessions: any[]): void {
    for (const userSession of userSessions) {
      userSession.visible = true;
      this.userSessionAnnotationData.set(userSession.id, {
        AnnotationData: new Map<number, Array<DataPoint>>(),
      });
      for (const marker of this.markers) {
        this.userSessionAnnotationData.get(userSession.id)?.AnnotationData.set(marker.id, new Array<DataPoint>());
      }
      for (const annotation of userSession.annotations) {
        if (this.userSessionAnnotationData.get(userSession.id)) {
          this.userSessionAnnotationData
            .get(userSession.id)
            ?.AnnotationData.get(annotation.marker.id)
            ?.push({
              id: annotation.id,
              startTime: annotation.start,
              endTime: annotation.end != null ? annotation.end : 0,
              strength: annotation.value,
              display: annotation.end == null ? Display.Circle : Display.Rect,
              color: annotation.marker.color,
            });
        }
      }
      if (this.userSessionAnnotationData.get(userSession.id)?.AnnotationData) {
        // eslint-disable-next-line  @typescript-eslint/no-non-null-assertion
        this.userSessionAnnotationData.get(userSession.id)!.AnnotationData = new Map(
          [
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            ...this.userSessionAnnotationData.get(userSession.id)!.AnnotationData.entries(),
          ].sort()
        );
      }
    }
  }

  onSidebarHide() {
    this.navigationService.setSessionAnalysisSettingsSidePanelVisible(false);
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

  onUserSessionDisplayChange(value: boolean, userSession: UserSession) {
    if (this.session.userSessions) {
      this.session.userSessions = this.session.userSessions.map((u) =>
        u.id == userSession.id ? { ...u, visible: value } : u
      );
      this.appRef.tick();
      window.dispatchEvent(new Event('resize'));
    }
  }

  onMarkerDisplayChange(value: boolean, marker: Marker) {
    this.markers = this.markers.map((m) => (m.id == marker.id ? { ...m, visible: value } : m));

    const toolbars = this.sessionService.getFocusSession()?.toolbars;

    if (toolbars) {
      const toolbar = toolbars[0];
      this.toolbarService
        .setVisibilityForMarker(parseInt(toolbar.id), {
          markerId: marker.id.toString(),
          visible: value,
        })
        .subscribe({
          error: (error) => {
            console.log('Toolbar Update Error');
            console.log(error);
          },
        });
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
