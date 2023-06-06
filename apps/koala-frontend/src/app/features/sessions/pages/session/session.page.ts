import { Component, OnDestroy, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute } from '@angular/router';
import { MarkerService } from '../../services/marker.service';
import { MessageService } from 'primeng/api';
import { MediaControlService, MediaEvent, MediaActions } from '../../services/media-control.service';
import { SessionsService } from '../../services/sessions.service';
import { AnnotationService } from '../../services/annotation.service';
import { AuthService } from '../../../auth/services/auth.service';
import { environment } from '../../../../../environments/environment';
import { Session } from '../../types/session.entity';
import { DataPoint, Display } from '../../components/annotation/annotation.component';
import { Marker } from '../../types/marker.entity';
import { MarkerType, PlayMode } from '../../../../graphql/generated/graphql';
import { ToolbarMode } from '../../components/marker-toolbar/marker-toolbar.component';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { filter } from 'rxjs';
import { Subscription } from 'rxjs';
import { ToolbarsService } from '../../services/toolbars.service';
import { NavigationService } from '../../services/navigation.service';

@Component({
  selector: 'koala-app-session',
  templateUrl: './session.page.html',
  styleUrls: [
    './session.page.scss',
  ],
})
export class SessionPage implements OnInit, OnDestroy {
  sidePanelForm: FormGroup;
  ToolbarMode = ToolbarMode;
  PlayMode = PlayMode;

  waveContainer!: string;
  mediaUri: string = environment.production ? 'https://koala-app.de/api/media' : 'http://localhost:4200/api/media';
  sessionId = 0;
  session?: Session;
  AnnotationData: Map<number, Array<DataPoint>> = new Map<number, Array<DataPoint>>();
  AnnotationDislay = Display;
  markers: Marker[] = [];
  currentAudioTime = 0;
  totalAudioTime = 0;
  audioPaused = true;
  showSideBar = false;
  userID = -1;

  sessionUpdatedSubscription?: Subscription;
  toolbarUpdatedSubscription?: Subscription;

  sessionSettingsToggled$ = this.navigationService.sessionSettingsSidePanelToggled$;

  constructor(
    private readonly sessionService: SessionsService,
    private readonly annotationService: AnnotationService,
    private readonly markerService: MarkerService,
    private readonly authService: AuthService,
    private readonly route: ActivatedRoute,
    private readonly mediaControlService: MediaControlService,
    private readonly messageService: MessageService,
    private readonly translateService: TranslateService,
    private readonly formBuilder: FormBuilder,
    private readonly toolbarService: ToolbarsService,
    private readonly navigationService: NavigationService
  ) {
    this.sidePanelForm = this.formBuilder.group({
      details: this.formBuilder.group({
        editable: new FormControl<boolean>(false),
        enablePlayer: new FormControl<boolean>(false),
        displaySampleSolution: new FormControl<boolean>(false),
        enableLiveAnalysis: new FormControl<boolean>(false),
      }),
    });

    this.onSidePanelFormChanges();
  }

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
    this.sessionService.getOne(this.sessionId).subscribe(async (session) => {
      this.session = {
        ...session,
        media: session.media,
      };

      this.setSidePanelFormData(this.session);
      this.navigationService.setAnalysisNavEnabled(this.session.enableLiveAnalysis || false);

      const toolbars = this.session.toolbars;

      if (toolbars) {
        const toolbar = toolbars[0];

        this.toolbarUpdatedSubscription = this.toolbarService.subscribeUpdated(parseInt(toolbar.id)).subscribe({
          next: (data) => {
            const newMarkers = data.data?.toolbarUpdated.markers;
            if (newMarkers) {
              newMarkers.forEach((newMarker) => {
                const markerIndex = this.markers.findIndex((m) => m.id.toString() == newMarker.markerId);
                this.markers[markerIndex].visible = newMarker.visible;
              });
              //trigger change detection
              this.markers = [
                ...this.markers,
              ];
            }
          },
        });
      }

      if (this.session.isAudioSession && this.session.media) {
        this.mediaControlService.uuid = this.session.id;
        this.waveContainer = `waveContainer-${this.session.id}`;

        await this.loadMediaData(this.session.media.id);
      }

      const userSessions = this.session.userSessions?.filter((s) => s.id == this.userID);
      if (userSessions) {
        this.loadMarkerData(userSessions);
      }
    });

    this.sessionUpdatedSubscription = this.sessionService
      .subscribeUpdated(this.sessionId)
      .subscribe((session?: Session) => {
        if (session) {
          this.session = { ...session, owner: this.session?.owner, isOwner: this.session?.isOwner };
          this.setSidePanelFormData(this.session);
          this.navigationService.setAnalysisNavEnabled(this.session.enableLiveAnalysis || false);
        }
      });
  }

  ngOnDestroy(): void {
    if (this.session?.isAudioSession) {
      this.mediaControlService.stop();
    }
    this.sessionUpdatedSubscription?.unsubscribe();
    this.toolbarUpdatedSubscription?.unsubscribe();
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

  private setSidePanelFormData(session: Session): void {
    const sidePanelForm = this.sidePanelForm.get('details');
    let details = sidePanelForm?.value;

    if (details) {
      details = {
        ...details,
        editable: session.editable || false,
        enablePlayer: session.enablePlayer || false,
        displaySampleSolution: session.displaySampleSolution || false,
        enableLiveAnalysis: session.enableLiveAnalysis || false,
      };
    }

    //reset dirty state
    sidePanelForm?.reset(details);
  }

  onMarkerDisplayChange(value: boolean, marker: Marker) {
    this.markers = this.markers.map((m) => (m.id == marker.id ? { ...m, visible: value } : m));

    const toolbars = this.session?.toolbars;

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

  private loadMarkerData(userSessions: any[]): void {
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

          this.AnnotationData.set(marker.id, new Array<DataPoint>());
        }
        this.loadAnnotations(userSessions);
        this.markers = [
          ...this.markers,
        ];

        this.AnnotationData = new Map(this.AnnotationData);
      });
    }
  }

  private loadAnnotations(userSessions: any[]): void {
    if (userSessions.length > 0 && userSessions[0].annotations) {
      for (const annotation of userSessions[0].annotations) {
        this.AnnotationData.get(annotation.marker.id)?.push({
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

  getAudioMetadata() {
    try {
      return this.mediaControlService.getMetadata();
    } catch (error) {
      return undefined;
    }
  }

  onMarkerButtonEvent({ marker, value }: { marker: Marker; value?: number }) {
    if (this.audioPaused) {
      return;
    }
    let aData = this.AnnotationData.get(marker.id);
    if (aData == undefined) {
      // wtf typescript, how is this still undefined...
      aData = this.AnnotationData.set(marker.id, new Array<DataPoint>()).get(marker.id);
    } else {
      if (marker.type === MarkerType.Event) {
        this.onMarkerEvent(marker, aData);
      }
      if (marker.type === MarkerType.Range) {
        this.onMarkerRange(marker, aData);
      }
      if (marker.type === MarkerType.Slider) {
        this.onMarkerSliderRange(marker, aData, value || 0);
      }
    }
  }

  onMarkerEvent(m: Marker, aData: DataPoint[]) {
    const t = this.mediaControlService.getCurrentTime();
    this.AnnotationData.get(m.id)?.push({
      startTime: t,
      endTime: 0,
      strength: 0,
      id: aData.length,
      color: m.color,
      display: Display.Circle,
    });
    this.annotationService
      .create({
        start: Math.floor(t * 1000),
        userSessionId: this.userID,
        markerId: m.id,
      })
      .subscribe({
        error: (error) => {
          this.showErrorMessage('error', 'SESSION.ERROR_DIALOG.ANNOTATION_ERROR', '');
          console.log(error);
        },
      });
  }

  onMarkerRange(m: Marker, aData: DataPoint[]) {
    const t = this.mediaControlService.getCurrentTime();
    if (aData.length > 0) {
      const latest = aData.at(-1);
      if (latest?.endTime == 0) {
        latest.endTime = this.mediaControlService.getCurrentTime();
        this.annotationService
          .create({
            start: Math.floor(latest.startTime * 1000),
            end: Math.floor(latest.endTime * 1000),
            userSessionId: this.userID,
            markerId: m.id,
          })
          .subscribe({
            error: (error) => {
              this.showErrorMessage('error', 'SESSION.ERROR_DIALOG.ANNOTATION_ERROR', '');
              console.log(error);
            },
          });
        return;
      }
    }
    this.AnnotationData.get(m.id)?.push({
      startTime: t,
      endTime: 0,
      strength: 0,
      id: aData.length,
      color: m.color,
      display: Display.Rect,
    });
  }

  onMarkerSliderRange(m: Marker, aData: DataPoint[], value: number) {
    const strength = value;
    if (this.audioPaused) {
      return;
    }
    const t = this.mediaControlService.getCurrentTime();
    if (aData.length == 0) {
      aData.push({
        startTime: t,
        endTime: 0,
        strength: strength,
        id: 1,
        color: m.color,
        display: Display.Rect,
      });
      return;
    }
    const latest = aData.at(-1);
    if (latest && latest.strength != strength) {
      if (latest.endTime == 0) {
        latest.endTime = t;

        this.annotationService
          .create({
            start: Math.floor(latest.startTime * 1000),
            end: Math.floor(latest.endTime * 1000),
            value: latest.strength,
            userSessionId: this.userID,
            markerId: m.id,
          })
          .subscribe({
            error: (error) => {
              this.showErrorMessage('error', 'SESSION.ERROR_DIALOG.ANNOTATION_ERROR', '');
              console.log(error);
            },
          });
      }
      if (strength != 0) {
        aData.push({
          startTime: t,
          endTime: 0,
          strength: strength,
          id: aData.length,
          color: m.color,
          display: Display.Rect,
        });
      }
      this.AnnotationData.set(m.id, aData);
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

  onSidePanelFormChanges(): void {
    this.sidePanelForm.get('details')?.valueChanges.subscribe((details) => {
      if (this.sidePanelForm.get('details')?.dirty) {
        this.sessionService
          .update(parseInt(this.session?.id || '0'), {
            editable: details.editable,
            enablePlayer: details.enablePlayer,
            displaySampleSolution: details.displaySampleSolution,
            enableLiveAnalysis: details.enableLiveAnalysis,
          })
          .subscribe({
            error: () => {
              this.messageService.add({
                severity: 'error',
                summary: this.translateService.instant('SESSION.MAINTAIN.SESSION_SETTINGS.SAVE_ERROR_MESSAGE_TITLE'),
              });
            },
          });
      }
    });
  }

  onSidebarHide() {
    this.navigationService.setSessionSettingsSidePanelVisible(false);
  }

  onPlayModeChange(playMode: PlayMode) {
    const liveSessionStarted = this.session?.isAudioSession ? null : Date.now();
    this.sessionService.setPlayMode(parseInt(this.session?.id || '0'), { playMode, liveSessionStarted }).subscribe({
      next: (session: Session) => {
        this.session = session;
      },
    });
  }

  get sessionDetailsFormGroup(): FormGroup {
    return this.sidePanelForm.get('details') as FormGroup;
  }

  get markersFormGroup(): FormGroup {
    return this.sidePanelForm.get('markersArray') as FormGroup;
  }
}
