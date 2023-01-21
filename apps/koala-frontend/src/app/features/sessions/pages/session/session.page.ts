import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Session } from '../../../../graphql/generated/graphql';
import { MarkerService } from '../../services/marker.service';
import { MessageService } from 'primeng/api';
import { MediaControlService, MediaEvent } from '../../services/media-control.service';
import { SessionsService } from '../../services/sessions.service';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'koala-app-session',
  templateUrl: './session.page.html',
  styleUrls: [
    './session.page.scss',
  ],
})
export class SessionPage implements OnInit {
  maintainSessionForm!: FormGroup;
  maintainMarkerForm!: FormGroup;
  waveContainer!: string;
  mediaUri: string = environment.production ? 'https://koala-app.de/api/media' : 'http://localhost:4200/api/media';
  sessionId = 0;
  session!: Session;
  participants: any = [];

  constructor(
    private readonly sessionService: SessionsService,
    private readonly markerService: MarkerService,
    private readonly route: ActivatedRoute,
    private mediaControlService: MediaControlService,
    private readonly messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.sessionId = parseInt(this.route.snapshot.paramMap.get('sessionId') || '0');
    this.sessionService.getOne(this.sessionId).subscribe((result) => {
      this.session = {
        ...result.data?.session,
        media: result.data?.session.media,
      };
      if (this.session.media == undefined) {
        this.messageService.add({
          severity: 'info',
          summary: 'Kein Audio File gefunden',
          detail: 'Bitte speichern sie erst ein Audio File',
        });
        return;
      }
      this.mediaControlService.uuid = this.session.id;
      this.waveContainer = `waveContainer-${this.session.id}`;
      try {
        this.mediaControlService.load(`${this.mediaUri}/${this.session.id}`, this.waveContainer);
      } catch (e) {
        this.messageService.add({
          severity: 'error',
          summary: 'Audio Datei konnte nicht geladeb werden',
          detail: 'Bitte versuchen sie es spaeter noch einmal',
        });
        console.log(e);
      }
    });
  }

  getAudioMetadata() {
    try {
      const m = this.mediaControlService.getMetadata();
      return m;
    } catch (error) {
      return undefined;
    }
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
        if (evt.value != undefined) {
          this.mediaControlService.onVolumeChange(evt.value);
        }
        break;
    }
  }
}
