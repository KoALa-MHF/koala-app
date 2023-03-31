import { moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Marker } from '../../types/marker.entity';

export enum ToolbarMode {
  Maintenance,
  Session,
}

@Component({
  selector: 'koala-marker-toolbar',
  templateUrl: './marker-toolbar.component.html',
  styleUrls: [
    './marker-toolbar.component.scss',
  ],
})
export class MarkerToolbarComponent {
  @Input() toolbarMode: ToolbarMode = ToolbarMode.Maintenance;
  @Input() markers!: Marker[];
  @Output() sortChange = new EventEmitter<Marker[]>();
  @Output() event = new EventEmitter<Marker>();

  dragActive = false;
  draggedMarker: Marker | null = null;
  ToolbarMode = ToolbarMode;

  dropped(event: { previousIndex: number; currentIndex: number }) {
    const tempMarker = [
      ...this.markers,
    ];
    moveItemInArray(tempMarker, event.previousIndex, event.currentIndex);
    this.markers = tempMarker;

    this.sortChange.emit(this.markers);
  }

  onMarkerButtonEvent(m: Marker) {
    if (this.toolbarMode === ToolbarMode.Session) {
      this.event.emit(m);
    }
  }

  onDelete(event: any) {
    if (event.isPointerOverContainer) {
      this.markers = this.markers.filter((marker) => marker.id !== this.draggedMarker?.id);
      this.sortChange.emit(this.markers);

      this.dragActive = false;
    }
  }

  onDragStarted(marker: Marker) {
    this.dragActive = true;
    this.draggedMarker = marker;
  }

  onDragStopped() {
    this.dragActive = false;
  }
}
