import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  Session,
  SessionStatus,
} from 'apps/koala-frontend/src/app/graphql/generated/graphql';
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
        isEditable: new FormControl<boolean>(false),
        isPlayerEnabled: new FormControl<boolean>(false),
        isSampleSolutionDisplayed: new FormControl<boolean>(false),
        isLiveAnalysisDisplayed: new FormControl<boolean>(false),
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
        this.session = result.data?.session;

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
          ?.get('isEditable')
          ?.setValue(this.session.isEditable);

        this.maintainSessionForm
          .get('details')
          ?.get('isPlayerEnabled')
          ?.setValue(this.session.isPlayerEnabled);

        this.maintainSessionForm
          .get('details')
          ?.get('isSampleSolutionDisplayed')
          ?.setValue(this.session.isSampleSolutionDisplayed);

        this.maintainSessionForm
          .get('details')
          ?.get('isLiveAnalysisDisplayed')
          ?.setValue(this.session.isLiveAnalysisDisplayed);

        this.maintainSessionForm
          .get('dates')
          ?.get('start')
          ?.setValue(new Date(this.session.start));

        this.maintainSessionForm
          .get('dates')
          ?.get('end')
          ?.setValue(new Date(this.session.end));
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

    const isEditable =
      this.maintainSessionForm.get('details')?.get('isEditable')?.value ||
      false;

    const isPlayerEnabled =
      this.maintainSessionForm.get('details')?.get('isPlayerEnabled')?.value ||
      false;

    const isSampleSolutionDisplayed =
      this.maintainSessionForm.get('details')?.get('isSampleSolutionDisplayed')
        ?.value || false;

    const isLiveAnalysisDisplayed =
      this.maintainSessionForm.get('details')?.get('isLiveAnalysisDisplayed')
        ?.value || false;

    if (this.mode === 1) {
      this.sessionService
        .create({
          name,
          description,
          start,
          end,
          isEditable,
          isPlayerEnabled,
          isSampleSolutionDisplayed,
          isLiveAnalysisDisplayed,
        })
        .subscribe(() => {
          this.router.navigate(['sessions']);
        });
    } else {
      this.sessionService
        .update(this.session?.id || 0, {
          name,
          description,
          start,
          end,
          isEditable,
          isPlayerEnabled,
          isSampleSolutionDisplayed,
          isLiveAnalysisDisplayed,
          //status: SessionStatus.Open,
        })
        .subscribe(() => {
          this.router.navigate(['sessions']);
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
