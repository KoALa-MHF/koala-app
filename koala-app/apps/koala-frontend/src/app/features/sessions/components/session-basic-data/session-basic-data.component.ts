import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { CreateSessionInput } from 'apps/koala-frontend/src/app/generated/graphql';

@Component({
  selector: 'koala-app-session-basic-data',
  templateUrl: './session-basic-data.component.html',
  styleUrls: ['./session-basic-data.component.scss']
})
export class SessionBasicDataComponent implements OnInit {

  createSessionForm = this.fb.group({
    sessionName: ['', [Validators.required]],
  });

  @Output()
  created = new EventEmitter<CreateSessionInput>();

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {}

  onSubmit() {
    this.created.emit({
        name: this.createSessionForm.get('sessionName')?.value || ""
    });
  }

  /*public onSessionNameInputChanged(event: any) {
    this.session.name = event.target.value;
  }*/
}
