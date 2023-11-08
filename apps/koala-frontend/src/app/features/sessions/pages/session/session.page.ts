import { Component, OnDestroy, OnInit, ApplicationRef } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute } from '@angular/router';
import { MarkerService } from '../../../markers/services/marker.service';
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
import { filter, timer, Subscription } from 'rxjs';
import { ToolbarsService } from '../../services/toolbars.service';
import { NavigationService } from '../../services/navigation.service';
import { UserSession } from '../../types/user-session.entity';
import { SessionControlService } from '../../services/session-control.service';
import { AnnotationTextComment } from '../../components/annotation-text-comment/annotation-text-comment.component';
import { CheckboxChangeEvent } from 'primeng/checkbox';
import { AnnotationAudioComment } from '../../components/annotation-audio-comment/annotation-audio-comment.component';
import { MediaService } from '../../services/media.service';

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
  mediaUri: string = environment.production
    ? 'https://koala.mh-freiburg.de/api/media'
    : 'http://localhost:4200/api/media';
  sessionId = 0;
  AnnotationData: Map<number, Array<DataPoint>> = new Map<number, Array<DataPoint>>();
  AnnotationDislay = Display;
  markers: Marker[] = [];
  currentAudioTime = 0;
  totalAudioTime = 0;
  audioPaused = true;
  showSideBar = false;
  userID = -1;
  timer = '0:00';
  seeked = false;
  isBusy = false;
  private myUserSession?: UserSession;

  sessionUpdatedSubscription?: Subscription;
  toolbarUpdatedSubscription?: Subscription;
  private timerSubscription?: Subscription;
  private audioTimerSubscription?: Subscription;

  sessionSettingsToggled$ = this.navigationService.sessionSettingsSidePanelToggled$;
  session$ = this.sessionService.focusSessionChanged$;

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
    private readonly navigationService: NavigationService,
    private readonly sessionControlService: SessionControlService,
    private readonly mediaService: MediaService,
    private appRef: ApplicationRef
  ) {
    this.sidePanelForm = this.formBuilder.group({
      details: this.formBuilder.group({
        editable: new FormControl<boolean>(false),
        enablePlayer: new FormControl<boolean>(false),
        displaySampleSolution: new FormControl<boolean>(false),
        enableLiveAnalysis: new FormControl<boolean>(false),
        lockAnnotationDelete: new FormControl<boolean>(false),
      }),
    });

    this.onSidePanelFormChanges();
  }

  async ngOnInit() {
    this.isBusy = true;

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

    this.session$.subscribe((session?: Session) => {
      if (session) {
        this.myUserSession = this.sessionService
          .getFocusSession()
          ?.userSessions?.filter((userSession) => userSession.owner?.id === this.userID.toString())[0];
        this.setSidePanelFormData(session);

        this.loadAnnotations([
          this.myUserSession,
        ]);

        if (!session.isSessionOwner && session.isAudioSession && !session.enablePlayer) {
          this.mediaControlService.setPosition(session.playPosition || 0);
          this.currentAudioTime = session.playPosition || 0;

          if (session.playMode === PlayMode.Running) {
            this.audioTimerSubscription?.unsubscribe();
            this.audioTimerSubscription = timer(100, 100).subscribe(() => {
              const newAudioPosition = this.mediaControlService.getCurrentTime() + 0.1;
              this.mediaControlService.setPosition(newAudioPosition);
              this.currentAudioTime = newAudioPosition;
            });
          } else {
            this.audioTimerSubscription?.unsubscribe();
          }
        } else {
          this.audioTimerSubscription?.unsubscribe();
        }

        if (session.liveSessionStart && session.playMode === PlayMode.Running) {
          this.timerSubscription?.unsubscribe();
          this.timer = '0:00';

          this.timerSubscription = timer(1000, 1000).subscribe(() => {
            const timeDiff = this.sessionControlService.getCurrentTime() / 1000;

            const minutes = Math.floor(timeDiff / 60);
            const seconds = Math.floor(timeDiff % 60);
            let secondsLabel;

            if (seconds < 10) {
              secondsLabel = '0' + seconds;
            } else {
              secondsLabel = seconds.toString();
            }

            this.timer = minutes + ':' + secondsLabel;
          });
        } else {
          this.timerSubscription?.unsubscribe();
          this.timer = '0:00';
        }
      }
    });

    this.sessionService.setFocusSession(this.sessionId).subscribe(async (focusSession: Session) => {
      this.setSidePanelFormData(focusSession);

      const toolbars = focusSession.toolbars;

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

      if (focusSession.isAudioSession && focusSession.media) {
        this.mediaControlService.uuid = focusSession.id;
        this.waveContainer = `waveContainer-${focusSession.id}`;

        await this.loadMediaData(focusSession.media.id);
      } else {
        this.isBusy = false;
      }

      const userSessions = focusSession.userSessions?.filter((s) => (s.owner?.id || 0) == this.userID);
      if (userSessions) {
        this.loadMarkerData(userSessions);
      }
    });

    this.sessionUpdatedSubscription = this.sessionService.subscribeUpdated(this.sessionId);
  }

  ngOnDestroy(): void {
    if (this.sessionService.getFocusSession()?.isAudioSession) {
      this.sessionControlService.stopSession();
    }
    this.sessionUpdatedSubscription?.unsubscribe();
    this.toolbarUpdatedSubscription?.unsubscribe();
    this.timerSubscription?.unsubscribe();
    this.mediaControlService.destroy();
  }

  private loadMediaData(id: string): Promise<void> {
    return this.mediaControlService
      .load(`${this.mediaUri}/${id}`, this.waveContainer)
      .then(() => {
        this.mediaControlService.addEventHandler('audioprocess', (time) => {
          // to reduce update frequency
          this.currentAudioTime = time.toFixed(2);
        });

        this.mediaControlService.addEventHandler('click', () => {
          this.endActiveSliders(this.currentAudioTime);
        });

        this.mediaControlService.addEventHandler('finish', () => {
          this.endActiveSliders(this.totalAudioTime);
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
                this.totalAudioTime = this.sessionControlService.getDuration();
                //switch off busy state
                this.isBusy = false;

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
        lockAnnotationDelete: session.lockAnnotationDelete || false,
      };
    }

    //reset dirty state
    sidePanelForm?.reset(details);
  }

  private loadMarkerData(userSessions: any[]): void {
    const toolbars = this.sessionService.getFocusSession()?.toolbars;
    if (toolbars) {
      const toolbar = toolbars[0];
      const toolbarMarkers = toolbar?.markers || [];
      const markerIds: Array<number> = toolbarMarkers.map((marker) => parseInt(marker.markerId));
      this.markerService.getAll(markerIds).subscribe((result) => {
        const markers = result.data?.markers;
        toolbarMarkers.forEach((toolbarMarker) => {
          const marker = markers.find((t) => t.id == parseInt(toolbarMarker.markerId));
          if (marker) {
            this.markers.push({ ...marker, visible: toolbarMarker ? toolbarMarker.visible : true });
            this.AnnotationData.set(marker.id, new Array<DataPoint>());
          }
        });

        this.loadAnnotations(userSessions);
        this.markers = [
          ...this.markers,
        ];

        this.AnnotationData = new Map(
          [
            ...this.AnnotationData.entries(),
          ].sort()
        );
      });
    }
  }

  private loadAnnotations(userSessions: any[]): void {
    if (userSessions.length > 0 && userSessions[0].annotations) {
      this.AnnotationData = new Map(
        [
          ...this.AnnotationData.entries(),
        ].sort()
      );

      this.AnnotationData.forEach((data, key) => {
        this.AnnotationData.set(key, new Array<DataPoint>());
      });

      for (const annotation of userSessions[0].annotations) {
        this.AnnotationData.get(annotation.marker.id)?.push({
          id: annotation.id,
          note: annotation.note,
          startTime: annotation.start,
          endTime: annotation.end != 0 ? annotation.end : 0,
          strength: annotation.value,
          display: annotation.end == 0 ? Display.Circle : Display.Rect,
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
    let aData = this.AnnotationData.get(marker.id);
    if (aData == undefined) {
      aData = this.AnnotationData.set(marker.id, new Array<DataPoint>()).get(marker.id);
    } else {
      if (marker.type === MarkerType.Event) {
        this.onMarkerEvent(marker, aData);
      }
      if (marker.type === MarkerType.Range) {
        const filteredData = this.updateAnnotations(this.currentAudioTime, aData);
        this.onMarkerRange(marker, filteredData);
        this.AnnotationData.set(marker.id, filteredData);
      }
      if (marker.type === MarkerType.Slider) {
        const filteredData = this.updateAnnotations(this.currentAudioTime, aData);
        this.onMarkerSliderRange(marker, filteredData, value || 0);
        this.AnnotationData.set(marker.id, filteredData);
      }
    }
  }

  onMarkerEvent(m: Marker, aData: DataPoint[]) {
    let t = this.sessionControlService.getCurrentTime();
    t = Math.floor(t);

    const dp: DataPoint = {
      startTime: t,
      endTime: 0,
      id: aData.length,
      color: m.color,
      display: Display.Circle,
      note: '',
    };

    this.AnnotationData.get(m.id)?.push(dp);
    this.saveAnnotation(dp, m.id);
  }

  onMarkerRange(m: Marker, aData: DataPoint[]) {
    let t = this.sessionControlService.getCurrentTime();
    t = Math.floor(t);
    if (aData.length > 0) {
      const latest = aData.at(-1);
      if (latest) {
        if (latest.active) {
          latest.endTime = Math.floor(this.sessionControlService.getCurrentTime());
          latest.active = false;
          this.saveAnnotation(latest, m.id);
          return;
        }
      }
    }
    this.AnnotationData.get(m.id)?.push({
      startTime: t,
      endTime: 0,
      strength: 0,
      id: aData.length,
      color: m.color,
      display: Display.Rect,
      active: true,
      note: '',
    });
  }

  onMarkerSliderRange(m: Marker, aData: DataPoint[], value: number) {
    const strength = value;
    let t = this.sessionControlService.getCurrentTime();
    t = Math.floor(t);
    const latest = aData.at(-1);
    if (latest) {
      if (latest.active) {
        latest.endTime = t;
        latest.active = false;
        this.saveAnnotation(latest, m.id);
      }
    }
    if (strength != 0) {
      aData.push({
        startTime: t,
        endTime: 0,
        strength: strength,
        id: aData.length,
        color: m.color,
        display: Display.Rect,
        active: true,
        note: '',
      });
    }
    this.AnnotationData.set(m.id, aData);
  }

  onMediaEvent(evt: MediaEvent) {
    switch (evt.actions) {
      case MediaActions.Play:
        try {
          if (this.audioPaused) {
            this.sessionControlService.startSession().subscribe();
          } else {
            this.endActiveSliders(this.currentAudioTime);
            this.sessionControlService.pauseSession().subscribe();
            this.sessionService.setFocusSession(this.sessionId).subscribe((focusSession: Session) => {
              const userSessions = focusSession.userSessions?.filter((s) => (s.owner?.id || 0) == this.userID);
              if (userSessions) {
                this.loadAnnotations(userSessions);
                this.appRef.tick();
                window.dispatchEvent(new Event('resize'));
              }
            });
          }
        } catch (error) {
          this.showErrorMessage('error', 'SESSION.ERROR_DIALOG.MEDIA_CONTROLS', 'SESSION.ERROR_DIALOG.ERRORS.SUMMARY');
        }
        break;
      case MediaActions.Stop:
        try {
          this.endActiveSliders(this.currentAudioTime);
          this.sessionControlService.stopSession().subscribe();
          this.sessionService.setFocusSession(this.sessionId).subscribe((focusSession: Session) => {
            const userSessions = focusSession.userSessions?.filter((s) => (s.owner?.id || 0) == this.userID);
            if (userSessions) {
              this.loadAnnotations(userSessions);
              this.appRef.tick();
              window.dispatchEvent(new Event('resize'));
            }
          });
          this.currentAudioTime = 0;
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
          .update(parseInt(this.sessionService.getFocusSession()?.id || '0'), {
            editable: details.editable,
            enablePlayer: details.enablePlayer,
            displaySampleSolution: details.displaySampleSolution,
            enableLiveAnalysis: details.enableLiveAnalysis,
            lockAnnotationDelete: details.lockAnnotationDelete,
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
    if (playMode === PlayMode.Running) {
      this.sessionControlService.startSession().subscribe({
        next: () => {
          console.log('Session Started');
        },
      });
    } else {
      this.sessionControlService.stopSession().subscribe({
        next: () => {
          console.log('Session Stopped');
        },
      });
    }
  }

  onDeleteAnnotations(marker: Marker) {
    this.AnnotationData.get(marker.id)?.forEach((annotation) => {
      this.annotationService.remove(annotation.id).subscribe({
        error: (err) => {
          console.log(err);
          this.messageService.add({
            severity: 'error',
            summary: this.translateService.instant('SESSION.MAINTAIN.SESSION_SETTINGS.SAVE_ERROR_MESSAGE_TITLE'),
          });
        },
      });
    });

    this.AnnotationData.set(marker.id, new Array<DataPoint>());
    this.AnnotationData = new Map([
      ...this.AnnotationData.entries(),
    ]);
  }

  onAnnotationTextComment(annotationTextComment: AnnotationTextComment) {
    this.annotationService.updateNote(annotationTextComment.id, annotationTextComment.note).subscribe({
      next: () => {
        this.sessionService.setFocusSession(parseInt(this.sessionService.getFocusSession()?.id || '0')).subscribe();
      },
      error: () => {
        console.log('Error');
      },
    });
  }

  onAnnotationAudioComment(annotationAudioComment: AnnotationAudioComment) {
    this.mediaService.create({ file: annotationAudioComment.comment }).subscribe({
      next: (response) => {
        console.log(response);
      },
      error: (error) => {
        console.log(error);
      },
    });
    /*this.annotationService.updateNote(annotationTextComment.id, annotationTextComment.note).subscribe({
      next: () => {
        this.sessionService.setFocusSession(parseInt(this.sessionService.getFocusSession()?.id || '0')).subscribe();
      },
      error: () => {
        console.log('Error');
      },
    });*/
  }

  get sessionDetailsFormGroup(): FormGroup {
    return this.sidePanelForm.get('details') as FormGroup;
  }

  get markersFormGroup(): FormGroup {
    return this.sidePanelForm.get('markersArray') as FormGroup;
  }

  endActiveSliders(time: number) {
    this.AnnotationData.forEach((marker, id) => {
      this.AnnotationData.get(id)?.forEach((annotation, i) => {
        if (annotation.display == Display.Circle) {
          return;
        }
        if (annotation.active) {
          annotation.active = false;
          annotation.endTime = Math.floor(time * 1000);
          this.saveAnnotation(annotation, id);
        }
        return;
      });
    });
  }

  updateAnnotations(time: number, aData: DataPoint[]) {
    time = time * 1000;
    aData.forEach((dp: DataPoint) => {
      // ignore
      if (dp.endTime != 0 && dp.endTime < time) {
        return;
      }
      if (dp.active) {
        dp.endTime = time;
      }
      // all current/future annotations are transparent
      if (dp.startTime > time || dp.endTime > time) {
        dp.transparent = true;
      }
    });
    this.appRef.tick();
    window.dispatchEvent(new Event('resize'));
    return aData;
  }

  saveAnnotation(d: DataPoint, markerID: number) {
    this.annotationService
      .create({
        start: d.startTime,
        end: d.endTime,
        value: d.strength,
        userSessionId: this.myUserSession?.id || 0,
        markerId: markerID,
      })
      .subscribe({
        next: (result) => {
          d.id = result.data?.createAnnotation.id || 1;
        },
        error: (error) => {
          this.showErrorMessage('error', 'SESSION.ERROR_DIALOG.ANNOTATION_ERROR', '');
          console.log(error);
        },
      });
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

  onMarkersAllChange(event: CheckboxChangeEvent) {
    this.markers.forEach((marker) => {
      this.onMarkerDisplayChange(event.checked, marker);
    });
  }

  isAllCheckBoxSelected(values: Array<{ visible?: boolean }>): boolean {
    let count = 0;
    values.forEach((value) => {
      count += value.visible ? 1 : 0;
    });
    return count == values.length;
  }
}
