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
        sessionName: new FormControl<string>('', [Validators.required]),
        sessionDescription: new FormControl<string>(''),
        sessionType: new FormControl<string>('1', [Validators.required]),
      }),
      dates: this.formBuilder.group({
        online: new FormControl<boolean>(false),
        start: new FormControl<Date | null>(null),
        end: new FormControl<Date | null>(null),
      }),
      details: this.formBuilder.group({
        editable: new FormControl<boolean>(false),
        start: new FormControl<Date | null>(null),
        end: new FormControl<Date | null>(null),
        player: new FormControl<boolean>(false),
        sampleSolution: new FormControl<boolean>(false),
        analysis: new FormControl<boolean>(false),
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
          ?.get('sessionName')
          ?.setValue(this.session.name);

        this.maintainSessionForm
          .get('basicData')
          ?.get('sessionDescription')
          ?.setValue(this.session.description);
      });
    }
  }

  public onSave() {
    const sessionName =
      this.maintainSessionForm.get('basicData')?.get('sessionName')?.value ||
      '';
    const sessionDescription =
      this.maintainSessionForm.get('basicData')?.get('sessionDescription')
        ?.value || '';

    if (this.mode === 1) {
      this.sessionService
        .create({ name: sessionName, description: sessionDescription })
        .subscribe(() => {
          this.router.navigate(['sessions']);
        });
    } else {
      this.sessionService
        .update({
          id: this.session?.id || 0,
          name:
            this.maintainSessionForm.get('basicData')?.get('sessionName')
              ?.value || '',
          description:
            this.maintainSessionForm.get('basicData')?.get('sessionDescription')
              ?.value || '',
          status: SessionStatus.Open,
        })
        .subscribe(() => {
          this.router.navigate(['sessions']);
        });
    }
  }

  public onCancel() {}

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
