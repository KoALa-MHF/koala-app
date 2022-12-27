import { Component, Input, OnInit } from '@angular/core';
import { MarkerEntity } from '../../types/marker-preview';

@Component({
  selector: 'koala-marker-button',
  templateUrl: './marker-button.component.html',
  styleUrls: [
    './marker-button.component.scss',
  ],
})
export class MarkerButtonComponent implements OnInit {
  @Input() marker!: MarkerEntity;

  constructor() {}

  ngOnInit(): void {}
}
