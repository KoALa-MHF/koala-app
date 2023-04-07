import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { Table } from 'primeng/table';
import { Marker } from '../../types/marker.entity';

@Component({
  selector: 'koala-marker-overview-list',
  templateUrl: './marker-overview-list.component.html',
  styleUrls: [
    './marker-overview-list.component.scss',
  ],
})
export class MarkerOverviewListComponent {
  @Input() markers!: Marker[];
  @Output() markerAdd = new EventEmitter<Marker[]>();

  @ViewChild('markerOverviewTable') markerOverviewTable: Table | undefined;
  selectedMarkers: Marker[] = [];

  addMarker() {
    this.markerAdd.emit(this.selectedMarkers);
    this.selectedMarkers = [];
  }

  clear(table: Table, inputField: any) {
    table.clear();
    inputField.value = '';
  }

  applyFilterGlobal(event: any, stringVal: string) {
    this.markerOverviewTable?.filterGlobal((event.target as HTMLInputElement).value, stringVal);
  }
}
