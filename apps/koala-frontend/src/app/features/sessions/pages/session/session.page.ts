import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MediaType, Session, Media } from 'apps/koala-frontend/src/app/graphql/generated/graphql';
import { MarkerService } from '../../services/marker.service';
import { MediaService } from '../../services/media.service';
import { MediaControlService, MediaEvent } from '../../services/media-control.service';
import { SessionsService } from '../../services/sessions.service';

@Component({
  selector: 'koala-app-session',
  templateUrl: './session.page.html',
  styleUrls: [
    './session.page.scss',
  ],
})
export class SessionPage implements OnInit {
  maintainSessionForm: FormGroup;
  maintainMarkerForm: FormGroup;
  waveContainer = 'wave001';
  sessionId = 0;
  session: Session;
  media: Media;
  participants: any = [];

  constructor(
    private readonly sessionService: SessionsService,
    private readonly mediaService: MediaService,
    private readonly markerService: MarkerService,
    private readonly route: ActivatedRoute,
    private mediaControlService: MediaControlService
  ) {}

  ngOnInit(): void {
    this.sessionId = parseInt(this.route.snapshot.paramMap.get('sessionId') || '0');
    const testMedia: Media = {
      id: '1',
      createdAt: '01.01.2023',
      type: MediaType.Audio,
      updatedAt: '',
      title: 'some title',
      composer: 'some composer',
    };
    this.sessionService.getOne(this.sessionId).subscribe((result) => {
      this.session = {
        ...result.data?.session,
        media: result.data?.session.media || testMedia,
      };
      this.mediaControlService.uuid = this.session.id;

      (this.media = result.data?.session.media || testMedia),
        this.mediaControlService.load('assets/audio/test.mp3', this.waveContainer);
    });
  }

  onMediaEvent(evt: MediaEvent) {
    switch (evt.actions) {
      case 1:
        this.mediaControlService.play();
        break;
      case 2:
        this.mediaControlService.stop();
        break;
      case 3:
        this.mediaControlService.skipForward();
        break;
      case 4:
        this.mediaControlService.skipBackward();
        break;
      case 5:
        this.mediaControlService.onVolumeChange(evt.value);
        break;
    }
  }
}
