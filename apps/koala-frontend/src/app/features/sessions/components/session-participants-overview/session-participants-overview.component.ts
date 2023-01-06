import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'koala-session-participants-overview',
  templateUrl: './session-participants-overview.component.html',
  styleUrls: [
    './session-participants-overview.component.scss',
    '../../session-common.scss',
  ],
})
export class SessionParticipantsOverviewComponent implements OnInit {
  @Input() participants = [];

  @Output() participantRemove: EventEmitter<any> = new EventEmitter<any>();
  @Output() participantAdd: EventEmitter<any> = new EventEmitter<any>();

  addParticipantModal = false;
  participantForm!: FormGroup;

  constructor(private readonly formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.participantForm = this.formBuilder.group({
      email: new FormControl<string>('', [
        Validators.required,
      ]),
    });
  }

  onDelete(particpant: any) {
    this.participantRemove.emit(particpant);
  }

  onAddParticipantRequested() {
    this.addParticipantModal = true;
  }

  onAddParticipant() {
    //API call to add participant to invitation list
    this.participantAdd.emit(this.participantForm.get('email')?.value);
  }

  onCancel() {
    this.participantForm.reset();
    this.addParticipantModal = false;
  }
}
