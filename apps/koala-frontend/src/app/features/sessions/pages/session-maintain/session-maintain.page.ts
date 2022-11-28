import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  MediaType,
  Session,
} from 'apps/koala-frontend/src/app/graphql/generated/graphql';
import { MediaService } from '../../services/media.service';
import { SessionsService } from '../../services/sessions.service';

@Component({
  selector: 'koala-session-maintain',
  templateUrl: './session-maintain.page.html',
  styleUrls: ['./session-maintain.page.scss'],
})
export class SessionMaintainPage implements OnInit {
  maintainSessionForm: FormGroup;
  sessionId: number = 0;
  session: Session | null = null;
  mode: number = 1;

  constructor(
    private readonly sessionService: SessionsService,
    private readonly mediaService: MediaService,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private formBuilder: FormBuilder
  ) {
    this.maintainSessionForm = this.formBuilder.group({
      basicData: this.formBuilder.group({
        name: new FormControl<string>('', [Validators.required]),
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
  }

  ngOnInit(): void {
    this.sessionId = parseInt(
      this.route.snapshot.paramMap.get('sessionId') || '0'
    );

    if (this.sessionId != 0) {
      this.mode = 2;
    }

    if (this.mode === 2) {
      this.sessionService.getOne(this.sessionId).subscribe((result) => {
        this.session = {
          ...result.data?.session,
          media: result.data?.session.media || null,
        };

        this.maintainSessionForm
          .get('basicData')
          ?.get('name')
          ?.setValue(this.session.name);

        this.maintainSessionForm
          .get('basicData')
          ?.get('description')
          ?.setValue(this.session.description);

        this.maintainSessionForm
          .get('details')
          ?.get('editable')
          ?.setValue(this.session.editable);

        this.maintainSessionForm
          .get('details')
          ?.get('enablePlayer')
          ?.setValue(this.session.enablePlayer);

        this.maintainSessionForm
          .get('details')
          ?.get('displaySampleSolution')
          ?.setValue(this.session.displaySampleSolution);

        this.maintainSessionForm
          .get('details')
          ?.get('enableLiveAnalysis')
          ?.setValue(this.session.enableLiveAnalysis);

        this.maintainSessionForm
          .get('dates')
          ?.get('start')
          ?.setValue(new Date(this.session.start));

        this.maintainSessionForm
          .get('dates')
          ?.get('end')
          ?.setValue(new Date(this.session.end));

        this.maintainSessionForm
          .get('audio')
          ?.get('title')
          ?.setValue(this.session.media?.title);

        this.maintainSessionForm
          .get('audio')
          ?.get('composer')
          ?.setValue(this.session.media?.composer);

        console.log(this.maintainSessionForm);
      });
    }
  }

  public onSave() {
    const name =
      this.maintainSessionForm.get('basicData')?.get('name')?.value || '';
    const description =
      this.maintainSessionForm.get('basicData')?.get('description')?.value ||
      '';

    const start =
      this.maintainSessionForm.get('dates')?.get('start')?.value || new Date();
    const end =
      this.maintainSessionForm.get('dates')?.get('end')?.value || new Date();

    const editable =
      this.maintainSessionForm.get('details')?.get('editable')?.value || false;

    const enablePlayer =
      this.maintainSessionForm.get('details')?.get('enablePlayer')
        ?.value || false;

    const displaySampleSolution =
      this.maintainSessionForm.get('details')?.get('displaySampleSolution')
        ?.value || false;

    const enableLiveAnalysis =
      this.maintainSessionForm.get('details')?.get('enableLiveAnalysis')
        ?.value || false;

    const audioTitle: string =
      this.maintainSessionForm.get('audio')?.get('title')?.value || '';

    const composer: string =
      this.maintainSessionForm.get('audio')?.get('composer')?.value || '';

    if (this.mode === 1) {
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
            .subscribe(() => {
              this.router.navigate(['sessions']);
            });
        });
    } else {
      this.mediaService
        .update(this.session?.media?.id || 0, { title: audioTitle, composer })
        .subscribe(() => {
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
              //status: SessionStatus.Open,
            })
            .subscribe(() => {
              this.router.navigate(['sessions']);
            });
        });
    }
  }

  public onCancel() {
    this.router.navigate(['sessions']);
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
}
