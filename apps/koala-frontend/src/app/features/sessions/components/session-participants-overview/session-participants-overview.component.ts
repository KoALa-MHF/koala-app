import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { UserSession } from '../../types/user-session.entity';

@Component({
  selector: 'koala-session-participants-overview',
  templateUrl: './session-participants-overview.component.html',
  styleUrls: [
    './session-participants-overview.component.scss',
    '../../session-common.scss',
  ],
})
export class SessionParticipantsOverviewComponent implements OnInit {
  @Input() participants: UserSession[] = [];

  @Output() participantRemove = new EventEmitter<UserSession>();
  @Output() participantAdd = new EventEmitter<UserSession>();

  addParticipantModal = false;
  showDeleteConfirm = false;
  selectedParticipant?: UserSession;

  participantForm!: FormGroup;

  constructor(private readonly formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.participantForm = this.formBuilder.group({
      email: new FormControl<string>('', [
        Validators.required,
      ]),
    });
  }

  onDeleteRequested(particpant: UserSession) {
    this.selectedParticipant = particpant;
    this.showDeleteConfirm = true;
  }

  onDelete(particpant: UserSession) {
    this.participantRemove.emit(particpant);
    delete this.selectedParticipant;
    this.showDeleteConfirm = false;
  }

  onAddParticipantRequested() {
    this.addParticipantModal = true;
  }

  onAddParticipant() {
    this.participantAdd.emit({
      id: 0,
      user: {
        email: this.participantForm.get('email')?.value,
      },
    });

    this.participantForm.reset();
    this.addParticipantModal = false;
  }

  onCancel() {
    this.participantForm.reset();
    this.addParticipantModal = false;
  }

  onDeleteCancel() {
    delete this.selectedParticipant;
    this.showDeleteConfirm = false;
  }
}
