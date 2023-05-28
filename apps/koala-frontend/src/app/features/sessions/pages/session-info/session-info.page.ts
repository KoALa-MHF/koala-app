import { Component, OnInit } from '@angular/core';
import { Session } from '../../types/session.entity';
import { Marker } from '../../types/marker.entity';
import { SessionsService } from '../../services/sessions.service';
import { ActivatedRoute } from '@angular/router';
import { MarkerService } from '../../services/marker.service';

@Component({
  selector: 'koala-session-info',
  templateUrl: './session-info.page.html',
  styleUrls: [
    './session-info.page.scss',
  ],
})
export class SessionInfoPage implements OnInit {
  session: Session | null = null;
  markers: Marker[] = [];

  constructor(
    private readonly route: ActivatedRoute,
    private readonly sessionService: SessionsService,
    private readonly markerService: MarkerService
  ) {}

  ngOnInit() {
    const sessionId = parseInt(this.route.snapshot.paramMap.get('sessionId') || '0');
    this.sessionService.getOne(sessionId).subscribe((session) => {
      this.session = session;

      const toolbars = this.session.toolbars;

      if (toolbars) {
        const toolbar = toolbars[0];
        const markerIds = toolbar.markers?.map((marker) => parseInt(marker.markerId));

        if (markerIds) {
          this.markerService.getAll(markerIds).subscribe((response) => {
            this.markers = response.data.markers.map((marker) => {
              return { ...marker, visible: true };
            });
          });
        }
      }
    });
  }
}
