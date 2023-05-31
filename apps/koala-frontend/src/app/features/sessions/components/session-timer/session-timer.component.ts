import { Component } from '@angular/core';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'koala-session-timer',
  templateUrl: './session-timer.component.html',
  styleUrls: [
    './session-timer.component.scss',
  ],
})
export class SessionTimerComponent {
  timerActions: MenuItem[] = [
    {
      label: 'Timer starten',

      icon: 'pi pi-clock',
      command: () => {
        console.log('Timer gestartet');
      },
    },
  ];
}
