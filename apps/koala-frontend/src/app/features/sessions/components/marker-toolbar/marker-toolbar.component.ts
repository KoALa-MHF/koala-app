import { moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Marker } from '../../types/marker.entity';
import { SessionControlService } from '../../services/session-control.service';
import { PlayMode } from '../../../../graphql/generated/graphql';

export enum ToolbarMode {
  Maintenance,
  Session,
  SessionDisabled,
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
  @Output() event = new EventEmitter<{ marker: Marker; value?: number }>();

  dragActive = false;
  draggedMarker: Marker | null = null;
  ToolbarMode = ToolbarMode;
  showDeleteConfirm = false;

  private currentPlayMode: PlayMode = PlayMode.Paused;

  playModeChanged$ = this.sessionControlService.playModeChanged$;

  constructor(private readonly sessionControlService: SessionControlService) {
    this.playModeChanged$.subscribe((playMode: PlayMode) => (this.currentPlayMode = playMode));
  }

  dropped(event: { previousIndex: number; currentIndex: number }) {
    const tempMarker = [
      ...this.markers,
    ];
    moveItemInArray(tempMarker, event.previousIndex, event.currentIndex);
    this.markers = tempMarker;

    this.sortChange.emit(this.markers);
  }

  onMarkerButtonEvent(event: { marker: Marker; value?: number }) {
    if (this.currentPlayMode === PlayMode.Running) {
      this.event.emit(event);
    }
  }

  onDeleteRequested(event: any) {
    if (event.isPointerOverContainer) {
      this.showDeleteConfirm = true;

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

  onDelete() {
    this.removeMarker();
  }

  onDeleteCancel() {
    this.showDeleteConfirm = false;
  }

  private removeMarker() {
    this.markers = this.markers.filter((marker) => marker.id !== this.draggedMarker?.id);
    this.sortChange.emit(this.markers);

    this.draggedMarker = null;
    this.showDeleteConfirm = false;
  }
}
