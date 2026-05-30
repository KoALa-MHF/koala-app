import { Component, Input } from '@angular/core';

@Component({
  selector: 'koala-app-media-wave',
  templateUrl: './media-wave.component.html',
  styleUrls: [
    './media-wave.component.scss',
    '../../session-common.scss',
  ],
  providers: [],
})
export class MediaWaveComponent {
  @Input() waveContainer: string | undefined;
}
