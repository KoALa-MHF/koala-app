import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { MutationResult } from 'apollo-angular';
import { MessageService } from 'primeng/api';
import { MarkerType, UpdateSessionMutation } from '../../../../graphql/generated/graphql';
import { UserSession } from '../../types/user-session.entity';
import { MarkerService } from '../../services/marker.service';
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
import { Subscription } from 'rxjs';

const DEFAULT_ICON_COLOR = '#555bcf';
const DEFAULT_VALUE_RANGE_FROM = 0;
const DEFAULT_VALUE_RANGE_TO = 10;

@Component({
  selector: 'koala-session-maintain',
  templateUrl: './session-maintain.page.html',
  styleUrls: [
    './session-maintain.page.scss',
    '../../session-common.scss',
  ],
})
export class SessionMaintainPage implements OnInit, OnDestroy {
  maintainSessionForm: FormGroup;
  maintainMarkerForm: FormGroup;

  sessionId!: number;
  session: Session | null = null;
  participants: UserSession[] = [];
  markers: Array<Marker> = [];

  markerTypeValueChangeSubscription?: Subscription;

  constructor(
    private readonly sessionService: SessionsService,
    private readonly toolbarService: ToolbarsService,
    private readonly mediaService: MediaService,
    private readonly markerService: MarkerService,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly formBuilder: FormBuilder,
    private readonly messageService: MessageService,
    private readonly userSessionService: UserSessionService,
    private readonly translateService: TranslateService
  ) {
    this.maintainSessionForm = this.formBuilder.group({
      basicData: this.formBuilder.group({
        name: new FormControl<string>('', [
          Validators.required,
        ]),
        description: new FormControl<string>(''),
      }),
      dates: this.formBuilder.group(
        {
          online: new FormControl<boolean>(false),
          start: new FormControl<Date | null>(null),
          end: new FormControl<Date | null>(null),
        },
        {
          validators: datesStartEndValidator,
        }
      ),
      details: this.formBuilder.group({
        editable: new FormControl<boolean>(false),
        enablePlayer: new FormControl<boolean>(false),
        displaySampleSolution: new FormControl<boolean>(false),
        enableLiveAnalysis: new FormControl<boolean>(false),
      }),
      audio: this.formBuilder.group({
        name: new FormControl<string>(''),
      }),
    });

    this.maintainMarkerForm = this.formBuilder.group(
      {
        type: new FormControl<string>('', [
          Validators.required,
        ]),
        name: new FormControl<string>('', [
          Validators.required,
        ]),
        description: new FormControl<string>(''),
        abbreviation: new FormControl<string>(''),
        color: new FormControl<string>(DEFAULT_ICON_COLOR, { nonNullable: true }),
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
  }

  /*--------------------------
  Session Basic Data Handling
  ----------------------------*/
  public onSave() {
    this.sessionService
      .update(parseInt(this.session?.id || '0'), {
        name: this.maintainSessionForm.value.basicData.name,
        description: this.maintainSessionForm.value.basicData.description,
        start: this.maintainSessionForm.value.dates.start,
        end: this.maintainSessionForm.value.dates.end,
        editable: this.maintainSessionForm.value.details.editable,
        enablePlayer: this.maintainSessionForm.value.details.enablePlayer,
        displaySampleSolution: this.maintainSessionForm.value.details.displaySampleSolution,
        enableLiveAnalysis: this.maintainSessionForm.value.details.enableLiveAnalysis,
      })
      .subscribe({
        next: (session: MutationResult<UpdateSessionMutation>) => {
          this.messageService.add({
            severity: 'success',
            summary: this.translateService.instant('SESSION.MAINTAIN.SESSION_SETTINGS.SAVE_SUCCESS_MESSAGE_TITLE', {
              sessionName: session.data?.updateSession.name,
            }),
          });
        },
        error: () => {
          this.messageService.add({
            severity: 'error',
            summary: this.translateService.instant('SESSION.MAINTAIN.SESSION_SETTINGS.SAVE_ERROR_MESSAGE_TITLE'),
          });
        },
      });
  }

  private setSessionGeneralDataForm(session: Session) {
    this.maintainSessionForm.get('basicData')?.get('name')?.setValue(session.name);
    this.maintainSessionForm.get('basicData')?.get('description')?.setValue(session.description);
    this.maintainSessionForm.get('details')?.get('editable')?.setValue(session.editable);
    this.maintainSessionForm.get('details')?.get('enablePlayer')?.setValue(session.enablePlayer);
    this.maintainSessionForm.get('details')?.get('displaySampleSolution')?.setValue(session.displaySampleSolution);
    this.maintainSessionForm.get('details')?.get('enableLiveAnalysis')?.setValue(session.enableLiveAnalysis);

    if (session.start) {
      this.maintainSessionForm.get('dates')?.get('start')?.setValue(new Date(session.start));
    }

    if (session.end) {
      this.maintainSessionForm.get('dates')?.get('end')?.setValue(new Date(session.end));
    }
  }

  private loadSessionData(sessionId: number) {
    this.sessionService.getOne(sessionId).subscribe((result) => {
      this.session = { ...result.data?.session };
      result.data
        ? (this.participants = [
            ...result.data.session.userSessions,
          ])
        : (this.participants = []);

      this.setSessionGeneralDataForm(this.session);

      const markers = this.session?.toolbars[0]?.markers || [];
      const markerIds: Array<number> = markers.map((marker) => parseInt(marker));
      this.refreshSessionMarkers(markerIds);
    });
  }

  public onCancel() {
    this.router.navigate([
      'sessions',
    ]);
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
              const m = { hidden: false, ...markers[i] };
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
      icon: this.maintainMarkerForm.value.icon,
      hidden: false,
      valueRangeFrom: this.maintainMarkerForm.value.valueRangeFrom,
      valueRangeTo: this.maintainMarkerForm.value.valueRangeTo,
    };
  }

  public onResetMarkerData() {
    this.maintainMarkerForm.reset({
      valueRangeFrom: DEFAULT_VALUE_RANGE_FROM,
      valueRangeTo: DEFAULT_VALUE_RANGE_TO,
      color: DEFAULT_ICON_COLOR,
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
        icon: this.maintainMarkerForm.value.icon,
        valueRangeFrom: this.maintainMarkerForm.value.valueRangeFrom,
        valueRangeTo: this.maintainMarkerForm.value.valueRangeTo,
      })
      .subscribe({
        next: (result) => {
          const markerId = result.data?.createMarker.id;

          if (markerId) {
            const toolbar = this.session?.toolbars[0];
            if (toolbar) {
              const markers = [
                ...toolbar.markers,
              ];
              markers.push(markerId + '');

              this.updateToolbarMarker(parseInt(toolbar.id), markers);
            }
          }
        },
        error: () => {
          console.error('Create Marker Error');
        },
      });
  }

  public onAddExistingMarkers(markers: Marker[]) {
    const toolbar = this.session?.toolbars[0];

    if (toolbar) {
      const updatedMarkers = [
        ...toolbar.markers,
      ];
      markers.forEach((marker) => {
        const found = updatedMarkers.findIndex((markerTemp) => marker.id.toString() === markerTemp);
        if (found === -1) {
          updatedMarkers.push(marker.id + '');
        }
      });
      this.updateToolbarMarker(parseInt(toolbar?.id || '0'), updatedMarkers);
    }
  }

  public onMarkerSortChange(markers: Marker[]) {
    const toolbar = this.session?.toolbars[0];
    if (toolbar) {
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
          //TODO: #103 Error Message for Participant Assignment
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
        //TODO: #104 Error Message for Participant Unassignment
        console.log('Error');
      },
    });
  }

  public onParticipantsInvite(message: string) {
    this.userSessionService
      .inviteParticpants(
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
