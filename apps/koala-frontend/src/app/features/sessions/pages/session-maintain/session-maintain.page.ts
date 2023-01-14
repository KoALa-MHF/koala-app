import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MutationResult } from 'apollo-angular';
import { MessageService } from 'primeng/api';
import { MarkerType, Session, UpdateSessionMutation } from '../../../../graphql/generated/graphql';
import { MarkerService } from '../../services/marker.service';
import { MediaService } from '../../services/media.service';
import { SessionsService } from '../../services/sessions.service';
import { MarkerEntity } from '../../types/marker-entity';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'koala-session-maintain',
  templateUrl: './session-maintain.page.html',
  styleUrls: [
    './session-maintain.page.scss',
    '../../session-common.scss',
  ],
})
// eslint-disable-next-line @angular-eslint/component-class-suffix
export class SessionMaintainPage implements OnInit {
  maintainSessionForm: FormGroup;
  maintainMarkerForm: FormGroup;

  sessionId!: number;
  session: Session | null = null;
  participants: any = [];

  constructor(
    private readonly sessionService: SessionsService,
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
      dates: this.formBuilder.group({
        online: new FormControl<boolean>(false),
        start: new FormControl<Date | null>(null),
        end: new FormControl<Date | null>(null),
      }),
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

    this.maintainMarkerForm = this.formBuilder.group({
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
    });
  }

  ngOnInit(): void {
    this.sessionId = parseInt(this.route.snapshot.paramMap.get('sessionId') || '0');

    this.sessionService.getOne(this.sessionId).subscribe((result) => {
      this.session = {
        ...result.data?.session,
        media: result.data?.session.media || null,
      };

      this.maintainSessionForm.get('basicData')?.get('name')?.setValue(this.session.name);

      this.maintainSessionForm.get('basicData')?.get('description')?.setValue(this.session.description);

      this.maintainSessionForm.get('details')?.get('editable')?.setValue(this.session.editable);

      this.maintainSessionForm.get('details')?.get('enablePlayer')?.setValue(this.session.enablePlayer);

      this.maintainSessionForm
        .get('details')
        ?.get('displaySampleSolution')
        ?.setValue(this.session.displaySampleSolution);

      this.maintainSessionForm.get('details')?.get('enableLiveAnalysis')?.setValue(this.session.enableLiveAnalysis);

      if (this.session.start) {
        this.maintainSessionForm.get('dates')?.get('start')?.setValue(new Date(this.session.start));
      }

      if (this.session.end) {
        this.maintainSessionForm.get('dates')?.get('end')?.setValue(new Date(this.session.end));
      }

      this.maintainSessionForm.get('audio')?.get('title')?.setValue(this.session.media?.name);
    });
  }

  public onSave() {
    this.saveSession();
  }

  public onCancel() {
    this.router.navigate([
      'sessions',
    ]);
  }

  public onParticipantRemove(participant: any) {
    const index = this.participants.findIndex((p: any) => {
      return p.email === participant.email ? true : false;
    });

    if (index >= 0) {
      this.participants.splice(index, 1);
    }
  }

  public onParticipantAdd(participant: any) {
    this.participants.push({
      email: participant,
    });
  }

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

  get markerData(): MarkerEntity {
    return {
      id: 0,
      description: '',
      name: '',
      type: this.getMarkerTypeValue(),
      abbreviation: this.getMarkerAbbreviationValue(),
      color: this.getMarkerColorValue(),
      icon: this.getMarkerIconValue(),
    };
  }

  get markers(): MarkerEntity[] {
    return (
      this.session?.markers?.map((marker) => {
        return {
          id: marker.id,
          name: marker.name,
          abbreviation: marker.abbreviation,
          description: marker.description,
          type: marker.type,
          color: '',
          icon: '',
        };
      }) || []
    );
  }

  private getMarkerIconValue(): string {
    return this.maintainMarkerForm.get('icon')?.value || '';
  }

  private getMarkerTypeValue(): MarkerType {
    return this.maintainMarkerForm.get('type')?.value || '';
  }

  private getMarkerAbbreviationValue(): string {
    return this.maintainMarkerForm.get('abbreviation')?.value;
  }

  private getMarkerColorValue(): string {
    return this.maintainMarkerForm.get('color')?.value;
  }

  public onResetMarkerData() {
    this.maintainMarkerForm.reset();
  }

  private saveSession() {
    const name = this.maintainSessionForm.get('basicData')?.get('name')?.value || '';
    const description = this.maintainSessionForm.get('basicData')?.get('description')?.value || '';

    const start = this.maintainSessionForm.get('dates')?.get('start')?.value;
    const end = this.maintainSessionForm.get('dates')?.get('end')?.value;

    const editable = this.maintainSessionForm.get('details')?.get('editable')?.value || false;

    const enablePlayer = this.maintainSessionForm.get('details')?.get('enablePlayer')?.value || false;

    const displaySampleSolution = this.maintainSessionForm.get('details')?.get('displaySampleSolution')?.value || false;

    const enableLiveAnalysis = this.maintainSessionForm.get('details')?.get('enableLiveAnalysis')?.value || false;

    this.sessionService
      .update(parseInt(this.session?.id || '0'), {
        name,
        description,
        start,
        end,
        editable,
        enablePlayer,
        displaySampleSolution,
        enableLiveAnalysis,
      })
      .subscribe({
        next: (session: MutationResult<UpdateSessionMutation>) => {
          this.messageService.add({
            severity: 'success',
            summary: "Änderungen an Session '" + session.data?.updateSession.name + "' wurden gespeichert",
          });
        },
        error: (session: MutationResult<UpdateSessionMutation>) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Änderungen an Session konnten nicht gespeichert werden',
          });
        },
      });
  }

  public onAddMarker() {
    const type = this.maintainMarkerForm.get('type')?.value || '';
    const name = this.maintainMarkerForm.get('name')?.value || '';
    const description = this.maintainMarkerForm.get('description')?.value || '';
    const abbreviation = this.maintainMarkerForm.get('abbreviation')?.value || '';
    const color = this.maintainMarkerForm.get('color')?.value || '';
    const icon = this.maintainMarkerForm.get('icon')?.value || '';

    this.markerService
      .create({
        name,
        type,
        color,
        abbreviation,
        description,
      })
      .subscribe({
        next: (result) => {
          const markerId = result.data?.createMarker.id;

          if (markerId) {
            this.sessionService.addMarker(markerId, this.sessionId).subscribe({
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
        },
        error: () => {
          console.error('Create Marker Error');
        },
      });
  }

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
          this.messageService.add({
            severity: 'error',
            summary: 'Dateiupload fehlerhaft',
            detail: 'Die Datei konnte nicht hochgeladen werden. Bitte versuche es erneut',
          });
        },
      });
  }
}
