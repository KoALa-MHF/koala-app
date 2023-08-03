import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Table } from 'primeng/table';
import { Marker } from '../../../sessions/types/marker.entity';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'koala-marker-overview-list',
  templateUrl: './marker-overview-list.component.html',
  styleUrls: [
    './marker-overview-list.component.scss',
  ],
})
export class MarkerOverviewListComponent implements OnInit {
  @Input() markers!: Marker[];
  @Input() selectedMarkers: Marker[] = [];
  @Output() selectedMarkersChange = new EventEmitter();

  @ViewChild('markerOverviewTable') markerOverviewTable: Table | undefined;

  types!: any[];

  constructor(private readonly translateService: TranslateService) {}

  ngOnInit(): void {
    this.types = [
      { label: this.translateService.instant('MARKER.TYPE.EVENT'), value: 'EVENT' },
      { label: this.translateService.instant('MARKER.TYPE.RANGE'), value: 'RANGE' },
      { label: this.translateService.instant('MARKER.TYPE.SLIDER'), value: 'SLIDER' },
    ];
  }

  onSelectionChanged(selectedMarkers: Marker[]) {
    this.selectedMarkersChange.emit(selectedMarkers);
  }

  clear(table: Table, inputField: any) {
    table.clear();
    inputField.value = '';
  }

  applyFilterGlobal(event: any, stringVal: string) {
    this.markerOverviewTable?.filterGlobal((event.target as HTMLInputElement).value, stringVal);
  }
}
