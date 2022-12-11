import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'koala-marker-preview',
  templateUrl: './marker-preview.component.html',
  styleUrls: ['./marker-preview.component.scss', '../../session-common.scss'],
})
export class MarkerPreviewComponent implements OnInit {
  @Input() label: string = "";
  @Input() color: string = "";
  @Input() markerType: string = "";
  @Input() icon: string = "";
  
  constructor() {}

  ngOnInit(): void {}
}
