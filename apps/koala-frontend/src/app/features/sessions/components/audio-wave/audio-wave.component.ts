import { Component, Input } from '@angular/core';

@Component({
  selector: 'koala-app-audio-wave',
  templateUrl: './audio-wave.component.html',
  styleUrls: [
    './audio-wave.component.scss',
    '../../session-common.scss',
  ],
  providers: [],
})
export class AudioWaveComponent {
  @Input() waveContainer: string | undefined;
}
