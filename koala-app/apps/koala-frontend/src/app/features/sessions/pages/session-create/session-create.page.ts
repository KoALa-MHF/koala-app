import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { SessionsService } from '../../services/sessions.service';

@Component({
  selector: 'koala-session-create',
  templateUrl: './session-create.page.html',
  styleUrls: ['./session-create.page.scss'],
})
export class SessionCreatePage implements OnInit {
  createSessionForm: FormGroup;

  constructor(
    private readonly sessionService: SessionsService,
    private readonly router: Router,
    private formBuilder: FormBuilder
  ) {
    this.createSessionForm = this.formBuilder.group({
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

  ngOnInit(): void {}

  public onSessionCreated() {
    const sessionName = this.createSessionForm.get('basicData')?.get('sessionName')?.value || '';

    this.sessionService.create(sessionName).subscribe(() => {
      this.router.navigate(['sessions']);
    });
  }

  public onCancel() {

  }

  get basicDataFormGroup(): FormGroup {
    return this.createSessionForm.get('basicData') as FormGroup;
  }

  get datesFormGroup(): FormGroup {
    return this.createSessionForm.get('dates') as FormGroup;
  }

  get detailsFormGroup(): FormGroup {
    return this.createSessionForm.get('details') as FormGroup;
  }

  get audioFormGroup(): FormGroup {
    return this.createSessionForm.get('audio') as FormGroup;
  }
}
