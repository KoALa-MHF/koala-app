import { Component, Input } from '@angular/core';

@Component({
  selector: 'koala-app-session-audio-wave',
  templateUrl: './session-audio-wave.component.html',
  styleUrls: [
    './session-audio-wave.component.scss',
    '../../session-common.scss',
  ],
  providers: [],
})
export class SessionAudioWaveComponent {
  @Input() waveContainer: string;
}
