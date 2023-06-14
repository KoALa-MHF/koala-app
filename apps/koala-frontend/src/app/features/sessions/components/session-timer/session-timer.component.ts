import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PlayMode } from '../../../../graphql/generated/graphql';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'koala-session-timer',
  templateUrl: './session-timer.component.html',
  styleUrls: [
    './session-timer.component.scss',
  ],
})
export class SessionTimerComponent {
  @Input() playMode: PlayMode = PlayMode.Paused;
  @Input() disabled = false;
  @Output() playModeChanged = new EventEmitter<PlayMode>();

  PlayMode = PlayMode;

  timerActions: MenuItem[] = [
    {
      label: 'Timer starten',

      icon: 'pi pi-clock',
      command: () => {
        console.log('Timer gestartet');
      },
    },
  ];

  toggleTimer() {
    if (this.playMode === PlayMode.Paused) {
      this.playModeChanged.next(PlayMode.Running);
    } else {
      this.playModeChanged.next(PlayMode.Paused);
    }
  }
}
