import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { SessionStatus } from '../../../../graphql/generated/graphql';

interface SessionStatusOption {
  name: string;
  code: string;
}

@Component({
  selector: 'koala-session-dates',
  templateUrl: './session-dates.component.html',
  styleUrls: [
    './session-dates.component.scss',
    '../../session-common.scss',
  ],
})
export class SessionDatesComponent {
  @Input() sessionDatesForm!: FormGroup;

  sessionStatus: SessionStatusOption[] = [
    {
      name: this.translateSession.instant('SESSION.MAINTAIN.SESSION_SETTINGS.STATUS.IN_PREPARATION_LABEL'),
      code: SessionStatus.InPreparation,
    },
    {
      name: this.translateSession.instant('SESSION.MAINTAIN.SESSION_SETTINGS.STATUS.OPEN_LABEL'),
      code: SessionStatus.Open,
    },
    {
      name: this.translateSession.instant('SESSION.MAINTAIN.SESSION_SETTINGS.STATUS.CLOSED_LABEL'),
      code: SessionStatus.Closed,
    },
    {
      name: this.translateSession.instant('SESSION.MAINTAIN.SESSION_SETTINGS.STATUS.ARCHIVED_LABEL'),
      code: SessionStatus.Archived,
    },
  ];

  constructor(private readonly translateSession: TranslateService) {}
}
