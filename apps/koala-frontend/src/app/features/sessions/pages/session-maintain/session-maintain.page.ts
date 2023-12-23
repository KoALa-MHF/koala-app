import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { MessageService } from 'primeng/api';
import { MarkerType, SessionStatus } from '../../../../graphql/generated/graphql';
import { UserSession } from '../../types/user-session.entity';
import {
  DEFAULT_ICON_COLOR,
  DEFAULT_VALUE_RANGE_FROM,
  DEFAULT_VALUE_RANGE_TO,
  MarkerService,
} from '../../../markers/services/marker.service';
import { MediaService } from '../../services/media.service';
import { SessionsService } from '../../services/sessions.service';
import { ToolbarsService } from '../../services/toolbars.service';
import { Marker } from '../../types/marker.entity';
import { Session } from '../../types/session.entity';
import { iconAbbreviationValidator } from '../../../../shared/icon-abbreviation.validator';
import { datesStartEndValidator } from '../../../../shared/dates.validator';
import { markerRangeValueValidator } from '../../../../shared/greater-than.validator';
import { UserSessionService } from '../../services/user-session.service';
import { TranslateService } from '@ngx-translate/core';
import { Subscription, debounceTime, fromEvent, pairwise, startWith } from 'rxjs';
import { TabView } from 'primeng/tabview';
import { DomHandler } from 'primeng/dom';

@Component({
  selector: 'koala-session-maintain',
  templateUrl: './session-maintain.page.html',
  styleUrls: [
    './session-maintain.page.scss',
    '../../session-common.scss',
  ],
})
export class SessionMaintainPage implements OnInit, OnDestroy, AfterViewInit {
  maintainSessionForm: FormGroup;
  maintainMarkerForm: FormGroup;

  sessionId!: number;
  session: Session | null = null;
  participants: UserSession[] = [];
  markers: Array<Marker> = [];

  activeTabViewIndex = 0;

  @ViewChild(TabView) tabViewRef!: TabView;

  markerTypeValueChangeSubscription?: Subscription;
  windowResizeTabViewUpdateSubscription?: Subscription;
  basicDataChangeSubscription?: Subscription;
  detailsChangeSubscription?: Subscription;
  datesChangeSubscription?: Subscription;

  constructor(
    private readonly sessionService: SessionsService,
    private readonly toolbarService: ToolbarsService,
    private readonly mediaService: MediaService,
    private readonly markerService: MarkerService,
    private readonly route: ActivatedRoute,
    private readonly formBuilder: FormBuilder,
    private readonly messageService: MessageService,
    private readonly userSessionService: UserSessionService,
    private readonly translateService: TranslateService
  ) {
    this.maintainSessionForm = this.formBuilder.group({
      basicData: this.formBuilder.group({
        name: new FormControl<string>('', {
          updateOn: 'blur',
          validators: [
            Validators.required,
          ],
        }),
        description: new FormControl<string>('', {
          updateOn: 'blur',
        }),
      }),
      dates: this.formBuilder.group(
        {
          status: new FormControl<SessionStatus | null>(null),
          start: new FormControl<Date | null>(null),
          end: new FormControl<Date | null>(null),
        },
        {
          updateOn: 'blur',
          validators: datesStartEndValidator,
        }
      ),
      details: this.formBuilder.group({
        editable: new FormControl<boolean>(false),
        enablePlayer: new FormControl<boolean>(false),
        displaySampleSolution: new FormControl<boolean>(false),
        enableLiveAnalysis: new FormControl<boolean>(false),
        lockAnnotationDelete: new FormControl<boolean>(false),
      }),
      audio: this.formBuilder.group({
        name: new FormControl<string>(''),
      }),
    });

    this.basicDataChangeSubscription = this.maintainSessionForm
      .get('basicData')
      ?.valueChanges.pipe(startWith(null), pairwise())
      .subscribe((valuesArray) => {
        const newValues = valuesArray[1];
        const oldValues = valuesArray[0];

        if (
          (!oldValues && this.maintainSessionForm.get('basicData')?.get('name')?.dirty === true) ||
          (oldValues && newValues.name !== oldValues?.name)
        ) {
          this.onSave('name', newValues.name);
        }

        if (
          (!oldValues && this.maintainSessionForm.get('basicData')?.get('description')?.dirty === true) ||
          (oldValues && newValues.description !== oldValues.description)
        ) {
          this.onSave('description', newValues.description);
        }
      });

    this.datesChangeSubscription = this.maintainSessionForm
      .get('dates')
      ?.valueChanges.pipe(startWith(null), pairwise())
      .subscribe((valuesArray) => {
        const newValues = valuesArray[1];
        const oldValues = valuesArray[0];

        if (
          (!oldValues && this.maintainSessionForm.get('dates')?.get('status')?.dirty === true) ||
          (oldValues && newValues.status !== oldValues.status)
        ) {
          this.onSave('status', newValues.status);
        }

        if (
          (!oldValues && this.maintainSessionForm.get('dates')?.get('start')?.dirty === true) ||
          (oldValues && newValues.start !== oldValues.start)
        ) {
          this.onSave('start', newValues.start);
        }

        if (
          (!oldValues && this.maintainSessionForm.get('dates')?.get('end')?.dirty === true) ||
          (oldValues && newValues.end !== oldValues.end)
        ) {
          this.onSave('end', newValues.end);
        }
      });

    this.detailsChangeSubscription = this.maintainSessionForm
      .get('details')
      ?.valueChanges.pipe(startWith(null), pairwise())
      .subscribe((valuesArray) => {
        const newValues = valuesArray[1];
        const oldValues = valuesArray[0];

        if (
          (!oldValues && this.maintainSessionForm.get('details')?.get('editable')?.dirty === true) ||
          (oldValues && newValues.editable !== oldValues.editable)
        ) {
          this.onSave('editable', newValues.editable);
        }

        if (
          (!oldValues && this.maintainSessionForm.get('details')?.get('enablePlayer')?.dirty === true) ||
          (oldValues && newValues.enablePlayer !== oldValues.enablePlayer)
        ) {
          this.onSave('enablePlayer', newValues.enablePlayer);
        }

        if (
          (!oldValues && this.maintainSessionForm.get('details')?.get('displaySampleSolution')?.dirty === true) ||
          (oldValues && newValues.displaySampleSolution !== oldValues.displaySampleSolution)
        ) {
          this.onSave('displaySampleSolution', newValues.displaySampleSolution);
        }

        if (
          (!oldValues && this.maintainSessionForm.get('details')?.get('enableLiveAnalysis')?.dirty === true) ||
          (oldValues && newValues.enableLiveAnalysis !== oldValues.enableLiveAnalysis)
        ) {
          this.onSave('enableLiveAnalysis', newValues.enableLiveAnalysis);
        }

        if (
          (!oldValues && this.maintainSessionForm.get('details')?.get('lockAnnotationDelete')?.dirty === true) ||
          (oldValues && newValues.lockAnnotationDelete !== oldValues.lockAnnotationDelete)
        ) {
          this.onSave('lockAnnotationDelete', newValues.lockAnnotationDelete);
        }
      });

    this.maintainMarkerForm = this.formBuilder.group(
      {
        type: new FormControl<MarkerType | null>(null, [
          Validators.required,
        ]),
        name: new FormControl<string>('', [
          Validators.required,
        ]),
        description: new FormControl<string>(''),
        abbreviation: new FormControl<string>(''),
        color: new FormControl<string>(DEFAULT_ICON_COLOR, { nonNullable: true }),
        contentColor: new FormControl<boolean>(false, { nonNullable: true }),
        icon: new FormControl<string>(''),
        valueRangeFrom: new FormControl<number>(DEFAULT_VALUE_RANGE_FROM),
        valueRangeTo: new FormControl<number>(DEFAULT_VALUE_RANGE_TO),
      },
      {
        validators: [
          iconAbbreviationValidator,
          markerRangeValueValidator,
        ],
      }
    );

    this.markerTypeValueChangeSubscription = this.maintainMarkerForm
      .get('type')
      ?.valueChanges.subscribe((currentType) => {
        switch (currentType) {
          case MarkerType.Event || MarkerType.Range:
            this.maintainMarkerForm.get('valueRangeFrom')?.reset(DEFAULT_VALUE_RANGE_FROM);
            this.maintainMarkerForm.get('valueRangeTo')?.reset(DEFAULT_VALUE_RANGE_TO);
            break;

          case MarkerType.Slider:
            this.maintainMarkerForm.get('icon')?.reset();
            this.maintainMarkerForm.get('abbreviation')?.reset();
            break;
        }
      });
  }

  ngOnInit(): void {
    //TODO: #102 error handling when session does not exist in backend, but this page is being loaded
    const routeSessionId = parseInt(this.route.snapshot.paramMap.get('sessionId') || '0');
    this.loadSessionData(routeSessionId);
  }

  ngOnDestroy(): void {
    this.markerTypeValueChangeSubscription?.unsubscribe();
    this.windowResizeTabViewUpdateSubscription?.unsubscribe();
    this.basicDataChangeSubscription?.unsubscribe();
    this.detailsChangeSubscription?.unsubscribe();
    this.datesChangeSubscription?.unsubscribe();
  }

  ngAfterViewInit() {
    this.applyFixesForTabViewScrollButtonVisibilty();
  }

  /**
   * This fix is to show the scroll button for tab view, see:
   *
   * https://github.com/primefaces/primeng/issues/11684#issuecomment-1511075837
   *
   * There is still an open bug:
   *
   * https://github.com/primefaces/primeng/issues/10674
   *
   * Should be fixed with pull request:
   * https://github.com/primefaces/primeng/pull/12913
   *
   * Once fixed, all those methods can be removed.
   */
  private applyFixesForTabViewScrollButtonVisibilty() {
    this.patchTabViewUpdateButtonState();
    this.calculateTabViewScrollButtonVisibility();
    this.subscribeToWindowResizeEvent();
  }

  /**
   * Subscribe to window resize Event in order to fix tab view scroll button visbility.
   * See @see applyFixesForTabViewScrollButtonVisibilty for more information on this bug.
   */
  private subscribeToWindowResizeEvent(): void {
    this.windowResizeTabViewUpdateSubscription = fromEvent(window, 'resize')
      .pipe(debounceTime(500))
      .subscribe(() => this.calculateTabViewScrollButtonVisibility());
  }

  /**
   * Patchting the orginal tab view updateButtonState function, as the scrollLeft sometimes can be float
   * and so the calculation is wrong leading into showing the buttons.
   *
   * See @see applyFixesForTabViewScrollButtonVisibilty for more information on this bug.
   */
  private patchTabViewUpdateButtonState() {
    this.tabViewRef.updateButtonState = function () {
      const content = (this.content as ElementRef).nativeElement;
      const { scrollLeft, scrollWidth } = content;
      const width = DomHandler.getWidth(content);

      this.backwardIsDisabled = scrollLeft === 0;
      this.forwardIsDisabled = Math.round(scrollLeft) >= scrollWidth - width;
    };
  }

  /**
   * This fix is to recalculate and show the scroll button for tab view if needed.
   *
   * See @see applyFixesForTabViewScrollButtonVisibilty for more information on this bug.
   */
  private calculateTabViewScrollButtonVisibility() {
    const prevBackwardIsDisabled = this.tabViewRef.backwardIsDisabled;
    const prevForwardIsDisabled = this.tabViewRef.forwardIsDisabled;

    this.tabViewRef.updateButtonState();
    this.tabViewRef.updateScrollBar(this.activeTabViewIndex);
    this.tabViewRef.updateInkBar();

    if (
      this.tabViewRef.forwardIsDisabled !== prevForwardIsDisabled ||
      this.tabViewRef.backwardIsDisabled !== prevBackwardIsDisabled
    ) {
      this.tabViewRef.cd.detectChanges();
    }
  }

  /*--------------------------
  Session Basic Data Handling
  ----------------------------*/
  public onSave(field: string, value: any) {
    this.sessionService
      .update(parseInt(this.session?.id || '0'), {
        [field]: value,
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

  private setSessionGeneralDataForm(session: Session) {
    this.maintainSessionForm.get('basicData')?.get('name')?.setValue(session.name, { emitEvent: false });
    this.maintainSessionForm.get('basicData')?.get('description')?.setValue(session.description);
    this.maintainSessionForm.get('details')?.get('editable')?.setValue(session.editable, { emitEvent: false });
    this.maintainSessionForm.get('details')?.get('enablePlayer')?.setValue(session.enablePlayer, { emitEvent: false });
    this.maintainSessionForm
      .get('details')
      ?.get('displaySampleSolution')
      ?.setValue(session.displaySampleSolution, { emitEvent: false });
    this.maintainSessionForm
      .get('details')
      ?.get('enableLiveAnalysis')
      ?.setValue(session.enableLiveAnalysis, { emitEvent: false });
    this.maintainSessionForm
      .get('details')
      ?.get('lockAnnotationDelete')
      ?.setValue(session.lockAnnotationDelete, { emitEvent: false });
    this.maintainSessionForm.get('dates')?.get('status')?.setValue(session.status, { emitEvent: false });

    if (session.start) {
      this.maintainSessionForm.get('dates')?.get('start')?.setValue(new Date(session.start), { emitEvent: false });
    }

    if (session.end) {
      this.maintainSessionForm.get('dates')?.get('end')?.setValue(new Date(session.end), { emitEvent: false });
    }
  }

  private loadSessionData(sessionId: number) {
    this.sessionService.setFocusSession(sessionId).subscribe((session) => {
      this.session = { ...session };
      this.session && this.session.userSessions
        ? (this.participants = [
            ...this.session.userSessions,
          ])
        : (this.participants = []);

      if (this.session) {
        this.setSessionGeneralDataForm(this.session);

        const sessionToolbars = this.session?.toolbars;
        if (sessionToolbars) {
          const markers = sessionToolbars[0].markers || [];
          const markerIds: Array<number> = markers.map((marker) => parseInt(marker.markerId));
          this.refreshSessionMarkers(markerIds);
        }
      }
    });
  }

  /*--------------------------
  Session Marker Handling
  ----------------------------*/
  private refreshSessionMarkers(markerIds: number[]) {
    this.markerService.getAll(markerIds).subscribe((result) => {
      //take read markers and put them in sorting order from toolbar
      const markers = result.data?.markers;

      if (markers) {
        //clear existing markers, because the complete set has been loaded newly
        this.markers = [];

        markerIds.forEach((markerId) => {
          for (let i = 0; i < markers.length; i++) {
            if (markers[i].id === markerId) {
              const m = { visible: true, ...markers[i] };
              this.markers.push(m);
            }
          }
        });
      }
    });
  }

  private updateToolbarMarker(toolbarId: number, markerIds: string[]) {
    this.toolbarService
      .update(toolbarId, {
        markers: markerIds,
      })
      .subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: this.translateService.instant('SESSION.MAINTAIN.MARKER.MARKER_CREATION_SUCCESS_MESSAGE_TITLE'),
          });
          this.maintainMarkerForm.reset();
          this.loadSessionData(parseInt(this.session?.id || '0'));
        },
        error: () => {
          this.messageService.add({
            severity: 'error',
            summary: this.translateService.instant('SESSION.MAINTAIN.MARKER.MARKER_CREATION_ERROR_MESSAGE_TITLE'),
          });
        },
      });
  }

  get markerPreviewData(): Marker {
    return {
      id: 0,
      description: this.maintainMarkerForm.value.description,
      name: this.maintainMarkerForm.value.name,
      type: this.maintainMarkerForm.value.type,
      abbreviation: this.maintainMarkerForm.value.abbreviation,
      color: this.maintainMarkerForm.value.color,
      contentColor: this.maintainMarkerForm.value.contentColor ? '#000000' : '#FFFFFF',
      icon: this.maintainMarkerForm.value.icon,
      visible: true,
      valueRangeFrom: this.maintainMarkerForm.value.valueRangeFrom,
      valueRangeTo: this.maintainMarkerForm.value.valueRangeTo,
    };
  }

  public onResetMarkerData() {
    this.maintainMarkerForm.reset({
      valueRangeFrom: DEFAULT_VALUE_RANGE_FROM,
      valueRangeTo: DEFAULT_VALUE_RANGE_TO,
      color: DEFAULT_ICON_COLOR,
      contentColor: false,
    });
  }

  public onAddMarker() {
    this.markerService
      .create({
        description: this.maintainMarkerForm.value.description,
        name: this.maintainMarkerForm.value.name,
        type: this.maintainMarkerForm.value.type,
        abbreviation: this.maintainMarkerForm.value.abbreviation,
        color: this.maintainMarkerForm.value.color,
        contentColor: this.maintainMarkerForm.value.contentColor ? '#000000' : '#FFFFFF',
        icon: this.maintainMarkerForm.value.icon,
        valueRangeFrom: this.maintainMarkerForm.value.valueRangeFrom,
        valueRangeTo: this.maintainMarkerForm.value.valueRangeTo,
      })
      .subscribe({
        next: (result) => {
          const markerId = result.data?.createMarker.id;

          if (markerId) {
            const toolbars = this.session?.toolbars;
            if (toolbars) {
              const toolbar = toolbars[0];
              if (toolbar.markers) {
                const markers = [
                  ...toolbar.markers,
                ];
                markers.push({ markerId: markerId.toString(), visible: true });

                this.updateToolbarMarker(
                  parseInt(toolbar.id),
                  markers.map((toolbarMarker) => toolbarMarker.markerId)
                );
              }
            }
          }
        },
        error: () => {
          console.error('Create Marker Error');
        },
      });
  }

  public onAddExistingMarkers(markers: Marker[]) {
    const toolbars = this.session?.toolbars;

    if (toolbars) {
      const toolbar = toolbars[0];
      if (toolbar.markers) {
        const updatedMarkers = [
          ...toolbar.markers,
        ];
        markers.forEach((marker) => {
          const found = updatedMarkers.findIndex((markerTemp) => marker.id.toString() === markerTemp.markerId);
          if (found === -1) {
            updatedMarkers.push({ markerId: marker.id.toString(), visible: true });
          }
        });
        this.updateToolbarMarker(
          parseInt(toolbar?.id || '0'),
          updatedMarkers.map((toolbarMarker) => toolbarMarker.markerId)
        );
      }
    }
  }

  public onMarkerSortChange(markers: Marker[]) {
    const toolbars = this.session?.toolbars;
    if (toolbars) {
      const toolbar = toolbars[0];
      this.updateToolbarMarker(
        parseInt(toolbar.id),
        markers.map((marker) => marker.id.toString())
      );
    }
  }

  /*----------------------------
  Audio/Media Handling
  ------------------------------*/
  public onFileUpload(file: File) {
    this.mediaService
      .create({
        file,
      })
      .subscribe({
        next: (value) => {
          this.sessionService
            .update(parseInt(this.session?.id || '0'), {
              description: this.session?.description,
              displaySampleSolution: this.session?.displaySampleSolution,
              editable: this.session?.editable,
              enableLiveAnalysis: this.session?.enableLiveAnalysis,
              lockAnnotationDelete: this.session?.lockAnnotationDelete,
              enablePlayer: this.session?.enablePlayer,
              end: this.session?.end,
              name: this.session?.name,
              start: this.session?.start,
              status: this.session?.status,
              mediaId: parseInt(value.data?.createMedia.id || '0'),
            })
            .subscribe({
              next: () => {
                this.messageService.add({
                  severity: 'success',
                  summary: this.translateService.instant('SESSION.MAINTAIN.AUDIO.UPLOAD_SUCCESS_MESSAGE_TITLE'),
                  detail: this.translateService.instant('SESSION.MAINTAIN.AUDIO.UPLOAD_SUCCESS_MESSAGE'),
                });

                this.loadSessionData(parseInt(this.session?.id || '0'));
              },
              error: (err) => {
                console.log(err);
              },
            });
        },
        error: () => {
          this.messageService.add({
            severity: 'error',
            summary: this.translateService.instant('SESSION.MAINTAIN.AUDIO.UPLOAD_ERROR_MESSAGE_TITLE'),
            detail: this.translateService.instant('SESSION.MAINTAIN.AUDIO.UPLOAD_ERROR_MESSAGE'),
          });
        },
      });
  }

  /*---------------------------
  Session Participants Handling
  -----------------------------*/
  public onParticipantAdd(participant: UserSession) {
    const sessionId = parseInt(this.session?.id || '0');
    if (this.session) {
      this.userSessionService.addParticipantToSession(sessionId, participant.owner?.email || '').subscribe({
        next: () => {
          this.loadSessionData(sessionId);
        },
        error: (error) => {
          this.messageService.add({
            severity: 'error',
            summary: this.translateService.instant('SESSION.MAINTAIN.PARTICIPANTS.ADD_ERROR_MESSAGE_TITLE'),
            detail: this.translateService.instant('SESSION.MAINTAIN.PARTICIPANTS.ADD_ERROR_MESSAGE'),
          });

          console.log(error);
        },
      });
    }
  }

  public onParticipantRemove(participant: UserSession) {
    this.userSessionService.removeParticipantFromSession(participant.id).subscribe({
      next: () => {
        this.loadSessionData(parseInt(this.session?.id || '0'));
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: this.translateService.instant('SESSION.MAINTAIN.PARTICIPANTS.REMOVE_ERROR_MESSAGE_TITLE'),
          detail: this.translateService.instant('SESSION.MAINTAIN.PARTICIPANTS.REMOVE_ERROR_MESSAGE'),
        });

        console.log('Error');
      },
    });
  }

  public onParticipantsInvite(message: string) {
    const sessionId = parseInt(this.session?.id || '0');
    this.userSessionService
      .inviteParticpants(
        sessionId,
        this.participants.map((participant) => participant.id.toString()),
        message
      )
      .subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: this.translateService.instant('SESSION.MAINTAIN.PARTICIPANTS.INVITATION_SUCCESS_MESSAGE_TITLE'),
            detail: this.translateService.instant('SESSION.MAINTAIN.PARTICIPANTS.INVITATION_SUCCESS_MESSAGE'),
          });
        },
        error: () => {
          this.messageService.add({
            severity: 'error',
            summary: this.translateService.instant('SESSION.MAINTAIN.PARTICIPANTS.INVITATION_ERROR_MESSAGE_TITLE'),
            detail: this.translateService.instant('SESSION.MAINTAIN.PARTICIPANTS.INVITATION_ERROR_MESSAGE'),
          });
        },
      });
  }

  /*-------------------------------------------------
  Getter for sub components to handle forms directly
  ---------------------------------------------------*/
  get basicDataFormGroup(): FormGroup {
    return this.maintainSessionForm.get('basicData') as FormGroup;
  }

  get datesFormGroup(): FormGroup {
    return this.maintainSessionForm.get('dates') as FormGroup;
  }

  get detailsFormGroup(): FormGroup {
    return this.maintainSessionForm.get('details') as FormGroup;
  }

  get audioFormGroup(): FormGroup {
    return this.maintainSessionForm.get('audio') as FormGroup;
  }
}
