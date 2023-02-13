import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { MutationResult } from 'apollo-angular';
import { datesStartEndValidator } from '../../../../shared/dates.validator';
import { MessageService } from 'primeng/api';
import { UpdateSessionMutation } from '../../../../graphql/generated/graphql';
import { MarkerService } from '../../services/marker.service';
import { MediaService } from '../../services/media.service';
import { SessionsService } from '../../services/sessions.service';
import { ToolbarsService } from '../../services/toolbars.service';
import { Marker } from '../../types/marker.entity';
import { Session } from '../../types/session.entity';
import { iconAbbreviationValidator } from '../../../../shared/icon-abbreviation.validator';

@Component({
  selector: 'koala-session-maintain',
  templateUrl: './session-maintain.page.html',
  styleUrls: [
    './session-maintain.page.scss',
    '../../session-common.scss',
  ],
})
export class SessionMaintainPage implements OnInit {
  maintainSessionForm: FormGroup;
  maintainMarkerForm: FormGroup;

  sessionId!: number;
  session: Session | null = null;
  participants: any = [];
  markers: Array<Marker> = [];

  constructor(
    private readonly sessionService: SessionsService,
    private readonly toolbarService: ToolbarsService,
    private readonly mediaService: MediaService,
    private readonly markerService: MarkerService,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly formBuilder: FormBuilder,
    private readonly messageService: MessageService
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
        color: new FormControl<string>('#555bcf', { nonNullable: true }),
        icon: new FormControl<string>(''),
      },
      {
        validators: iconAbbreviationValidator,
      }
    );
  }

  ngOnInit(): void {
    //TODO: error handling when session does not exist in backend, but this page is being loaded
    const routeSessionId = parseInt(this.route.snapshot.paramMap.get('sessionId') || '0');

    this.loadSessionData(routeSessionId);
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
          //TODO: #82 make success message for session update translatable
          this.messageService.add({
            severity: 'success',
            summary: "Änderungen an Session '" + session.data?.updateSession.name + "' wurden gespeichert",
          });
        },
        error: () => {
          //TODO: #83 make error message for session update translatable
          this.messageService.add({
            severity: 'error',
            summary: 'Änderungen an der Session konnten nicht gespeichert werden',
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
              this.markers.push(markers[i]);
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
            summary: 'Marker erfolgreich erstellt und der Session hinzugefügt',
          });
          this.maintainMarkerForm.reset();
        },
        error: () => {
          this.messageService.add({
            severity: 'error',
            summary: 'Markererstellung fehlgeschlagen',
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
    };
  }

  public onResetMarkerData() {
    this.maintainMarkerForm.reset();
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
                //TODO: make file upload success message translatable
                this.messageService.add({
                  severity: 'success',
                  summary: 'Dateiupload erfolgreich',
                  detail: 'Die Datei wurde erfolgreich hochgeladen und der Session zugewiesen',
                });
              },
              error: (err) => {
                console.log(err);
              },
            });
        },
        error: (err) => {
          //TODO: make file upload error message translatable
          this.messageService.add({
            severity: 'error',
            summary: 'Dateiupload fehlerhaft',
            detail: 'Die Datei konnte nicht hochgeladen werden. Bitte versuche es erneut',
          });
        },
      });
  }

  /*---------------------------
  Session Participants Handling
  -----------------------------*/
  public onParticipantAdd(participant: any) {
    this.participants.push({
      email: participant,
    });
  }

  public onParticipantRemove(participant: any) {
    const index = this.participants.findIndex((p: any) => {
      return p.email === participant.email ? true : false;
    });

    if (index >= 0) {
      this.participants.splice(index, 1);
    }
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
