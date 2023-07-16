import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { UserSession } from '../../types/user-session.entity';
import { SessionsService } from '../../services/sessions.service';
import { Session } from '../../types/session.entity';

@Component({
  selector: 'koala-session-participants-overview',
  templateUrl: './session-participants-overview.component.html',
  styleUrls: [
    './session-participants-overview.component.scss',
    '../../session-common.scss',
  ],
})
export class SessionParticipantsOverviewComponent implements OnInit, OnDestroy {
  @Input() participants: UserSession[] = [];

  @Output() participantRemove = new EventEmitter<UserSession>();
  @Output() participantAdd = new EventEmitter<UserSession>();

  addParticipantModal = false;
  showDeleteConfirm = false;
  selectedParticipant?: UserSession;

  participantForm!: FormGroup;
  sessionOwnerId = '0';

  focusSession$ = this.sessionService.focusSessionChanged$.subscribe(
    (session: Session) => (this.sessionOwnerId = session.owner?.id || '0')
  );

  constructor(private readonly formBuilder: FormBuilder, private readonly sessionService: SessionsService) {}

  ngOnInit(): void {
    this.participantForm = this.formBuilder.group({
      email: new FormControl<string>('', [
        Validators.required,
      ]),
    });
  }

  ngOnDestroy(): void {
    this.focusSession$.unsubscribe();
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
      owner: {
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
