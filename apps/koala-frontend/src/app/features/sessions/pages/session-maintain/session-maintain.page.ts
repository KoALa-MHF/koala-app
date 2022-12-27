import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MarkerType, MediaType, Session } from 'apps/koala-frontend/src/app/graphql/generated/graphql';
import { MarkerService } from '../../services/marker.service';
import { MediaService } from '../../services/media.service';
import { SessionsService } from '../../services/sessions.service';
import { MarkerEntity } from '../../types/marker-preview';

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

  constructor(
    private readonly sessionService: SessionsService,
    private readonly mediaService: MediaService,
    private readonly markerService: MarkerService,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly formBuilder: FormBuilder
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
        title: new FormControl<string>(''),
        composer: new FormControl<string>(''),
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

      this.maintainSessionForm.get('dates')?.get('start')?.setValue(new Date(this.session.start));

      this.maintainSessionForm.get('dates')?.get('end')?.setValue(new Date(this.session.end));

      this.maintainSessionForm.get('audio')?.get('title')?.setValue(this.session.media?.title);

      this.maintainSessionForm.get('audio')?.get('composer')?.setValue(this.session.media?.composer);
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
    console.log('=== Participant Deleted ===');
    console.log(participant);
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
        };
      }) || []
    );
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

    const start = this.maintainSessionForm.get('dates')?.get('start')?.value || new Date();
    const end = this.maintainSessionForm.get('dates')?.get('end')?.value || new Date();

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
        next: () => {
          console.log('Save successful');
        },
        error: () => {
          console.log('Save Error');
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
                this.maintainMarkerForm.reset();
              },
              error: () => {
                console.error('Add Marker to Session Error');
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
    /*this.createMediaGQL.mutate({ composer: '', title: '', type: MediaType.Audio, file }).subscribe({
      next(value) {
        console.log(value);
      },
      error(err) {
        console.log(err);
      },
    });*/
  }
}
