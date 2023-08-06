import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'koala-session-marker-maintain',
  templateUrl: './session-marker-maintain.component.html',
  styleUrls: [
    './session-marker-maintain.component.css',
  ],
})
export class SessionMarkerMaintainComponent {
  @Input() markerDataForm!: FormGroup;
}
