import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Table } from 'primeng/table';
import { Marker } from '../../../sessions/types/marker.entity';
import { TranslateService } from '@ngx-translate/core';
import { FormGroup } from '@angular/forms';

export interface DisplayedColumns {
  name: boolean;
  description: boolean;
  color: boolean;
  contentColor: boolean;
  type: boolean;
  abbreviation_icon: boolean;
}

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
  @Input() markerDataForm: FormGroup = new FormGroup([]);
  @Input() createEnabled = false;
  @Input() editEnabled = false;
  @Input() displayedColumns: DisplayedColumns = {
    name: false,
    description: false,
    color: false,
    contentColor: false,
    type: false,
    abbreviation_icon: false,
  };

  @Output() selectedMarkersChange = new EventEmitter();
  @Output() markerCreate = new EventEmitter();
  @Output() markerEdit = new EventEmitter<Marker>();
  @Output() resetMarkerData = new EventEmitter();

  @ViewChild('markerOverviewTable') markerOverviewTable: Table | undefined;

  types!: any[];

  createDialogVisible = false;

  clonedMarkers: { [n: number]: Marker } = {};

  get previewMarker(): Marker {
    return {
      id: 0,
      description: this.markerDataForm?.value.description,
      name: this.markerDataForm?.value.name,
      type: this.markerDataForm?.value.type,
      abbreviation: this.markerDataForm?.value.abbreviation,
      color: this.markerDataForm?.value.color,
      contentColor: this.markerDataForm?.value.contentColor ? '#000000' : '#FFFFFF',
      icon: this.markerDataForm?.value.icon,
      visible: true,
      valueRangeFrom: this.markerDataForm?.value.valueRangeFrom,
      valueRangeTo: this.markerDataForm?.value.valueRangeTo,
    };
  }

  constructor(private readonly translateService: TranslateService) {}

  ngOnInit(): void {
    this.types = [
      { label: this.translateService.instant('MARKER.TYPE.EVENT'), value: 'EVENT' },
      { label: this.translateService.instant('MARKER.TYPE.RANGE'), value: 'RANGE' },
      { label: this.translateService.instant('MARKER.TYPE.SLIDER'), value: 'SLIDER' },
    ];
  }

  onMarkerCreateRequested() {
    this.createDialogVisible = true;
  }

  onSelectionChanged(selectedMarkers: Marker[]) {
    this.selectedMarkersChange.emit(selectedMarkers);
  }

  onFormReset() {
    this.resetMarkerData.emit();
  }

  onCreateMarker() {
    this.markerCreate.emit();
    this.createDialogVisible = false;
  }

  clear(table: Table, inputField: any) {
    table.clear();
    inputField.value = '';
  }

  applyFilterGlobal(event: any, stringVal: string) {
    this.markerOverviewTable?.filterGlobal((event.target as HTMLInputElement).value, stringVal);
  }

  onMarkerDescriptionChange(event: any, marker: Marker) {
    this.clonedMarkers[marker.id].description = event.target.value;
  }

  onMarkerNameChange(event: any, marker: Marker) {
    this.clonedMarkers[marker.id].name = event.target.value;
  }

  onMarkerContentColorChange(contentColor: string, marker: Marker) {
    this.clonedMarkers[marker.id].contentColor = contentColor;
  }

  onMarkerColorChange(color: string, marker: Marker) {
    this.clonedMarkers[marker.id].color = color;
  }

  onRowEditInit(marker: Marker) {
    this.clonedMarkers[marker.id] = { ...marker };
  }

  onRowEditSave(marker: Marker) {
    //trigger save in host page
    this.markerEdit.emit(this.clonedMarkers[marker.id]);
    delete this.clonedMarkers[marker.id];
  }

  onRowEditCancel(marker: Marker) {
    //no changes, nothing to communicate to the host component
    delete this.clonedMarkers[marker.id];
  }
}
