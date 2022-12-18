import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MediaType, Session } from 'apps/koala-frontend/src/app/graphql/generated/graphql';
import { MenuItem } from 'primeng/api';
import { MediaService } from '../../services/media.service';
import { SessionsService } from '../../services/sessions.service';

enum mode {
  CREATE = 1,
  UPDATE = 2,
  DISPLAY = 3,
}

@Component({
  selector: 'koala-session-maintain',
  templateUrl: './session-maintain.page.html',
  styleUrls: [
    './session-maintain.page.scss',
  ],
})
export class SessionMaintainPage implements OnInit {
  maintainSessionForm: FormGroup;
  maintainMarkerForm: FormGroup;

  sessionId: number = 0;
  session: Session | null = null;
  mode: number = mode.CREATE;
  stepIndex: number = 0;
  participants: any = [];

  steps: MenuItem[] = [
    {
      label: 'Session Einstellungen',
    },
    {
      label: 'Marker',
    },
    {
      label: 'Mitglieder',
    },
  ];

  constructor(
    private readonly sessionService: SessionsService,
    private readonly mediaService: MediaService,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private formBuilder: FormBuilder
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

    if (this.sessionId != 0) {
      this.mode = mode.UPDATE;
    } else {
      this.mode = mode.CREATE;
    }

    if (this.mode === mode.UPDATE) {
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

  get markerData(): any {
    return {
      abbreviation: this.maintainMarkerForm.get('abbreviation')?.value,
      color: this.maintainMarkerForm.get('color')?.value,
    };
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

    const audioTitle: string = this.maintainSessionForm.get('audio')?.get('title')?.value || '';

    const composer: string = this.maintainSessionForm.get('audio')?.get('composer')?.value || '';

    if (this.mode === mode.CREATE) {
      if (audioTitle || composer) {
        this.mediaService
          .create({
            type: MediaType.Audio,
            title: audioTitle,
            composer,
          })
          .subscribe((result) => {
            this.sessionService
              .create({
                name,
                description,
                start,
                end,
                editable,
                enablePlayer,
                displaySampleSolution,
                enableLiveAnalysis,
                mediaId: result.data?.createMedia.id || 0,
              })
              .subscribe(() => {});
          });
      } else {
        this.sessionService
          .create({
            name,
            description,
            start,
            end,
            editable,
            enablePlayer,
            displaySampleSolution,
            enableLiveAnalysis,
          })
          .subscribe(() => {});
      }
    } else {
      if (audioTitle || composer) {
        this.mediaService.update(this.session?.media?.id || 0, { title: audioTitle, composer }).subscribe(() => {
          this.sessionService
            .update(this.session?.id || 0, {
              name,
              description,
              start,
              end,
              editable,
              enablePlayer,
              displaySampleSolution,
              enableLiveAnalysis,
            })
            .subscribe(() => {});
        });
      } else {
        this.sessionService
          .update(this.session?.id || 0, {
            name,
            description,
            start,
            end,
            editable,
            enablePlayer,
            displaySampleSolution,
            enableLiveAnalysis,
          })
          .subscribe(() => {});
      }
    }
  }
}
