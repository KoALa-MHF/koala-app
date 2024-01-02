import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { UserSession } from '../../types/user-session.entity';
import { SessionsService } from '../../services/sessions.service';
import { Session } from '../../types/session.entity';
import { ConfirmationService } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';

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

  participantForm!: FormGroup;
  sessionOwnerId = '0';

  focusSession$ = this.sessionService.focusSessionChanged$.subscribe(
    (session: Session) => (this.sessionOwnerId = session.owner?.id || '0')
  );

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly sessionService: SessionsService,
    private readonly confirmationService: ConfirmationService,
    private readonly translateService: TranslateService
  ) {}

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

  onDelete(particpant: UserSession) {
    this.confirmationService.confirm({
      message: particpant?.owner?.email
        ? this.translateService.instant('SESSION.MAINTAIN.PARTICIPANTS.DELETE_CONFIRM_DIALOG.EXPLANATION', {
            email: particpant?.owner?.email,
          })
        : this.translateService.instant('SESSION.MAINTAIN.PARTICIPANTS.DELETE_CONFIRM_DIALOG.EXPLANATION_NAME', {
            participantName: particpant?.owner?.displayName,
          }),
      header: this.translateService.instant('SESSION.MAINTAIN.PARTICIPANTS.DELETE_CONFIRM_DIALOG.TITLE'),
      icon: 'pi pi-exclamation-triangle',
      rejectLabel: this.translateService.instant('SESSION.DELETE_CONFIRM_DIALOG.CANCEL_BTN'),
      acceptLabel: this.translateService.instant('SESSION.DELETE_CONFIRM_DIALOG.CONFIRM_BTN'),
      accept: () => {
        this.participantRemove.emit(particpant);
      },
    });
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
}
