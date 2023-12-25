import { moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Marker } from '../../types/marker.entity';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmationService } from 'primeng/api';

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

  constructor(
    private readonly translateService: TranslateService,
    private readonly confirmationService: ConfirmationService
  ) {}

  dropped(event: { previousIndex: number; currentIndex: number }) {
    const tempMarker = [
      ...this.markers,
    ];
    moveItemInArray(tempMarker, event.previousIndex, event.currentIndex);
    this.markers = tempMarker;

    this.sortChange.emit(this.markers);
  }

  onMarkerButtonEvent(event: { marker: Marker; value?: number }) {
    if (this.toolbarMode === ToolbarMode.Session) {
      this.event.emit(event);
    }
  }

  onDelete(event: any) {
    if (event.isPointerOverContainer) {
      this.confirmationService.confirm({
        message: this.translateService.instant('SESSION.MAINTAIN.MARKER.DELETE_CONFIRM_DIALOG.EXPLANATION', {
          markerName: this.draggedMarker?.name,
        }),
        header: this.translateService.instant('SESSION.MAINTAIN.MARKER.DELETE_CONFIRM_DIALOG.TITLE'),
        icon: 'pi pi-exclamation-triangle',
        rejectLabel: this.translateService.instant('SESSION.DELETE_CONFIRM_DIALOG.CANCEL_BTN'),
        acceptLabel: this.translateService.instant('SESSION.DELETE_CONFIRM_DIALOG.CONFIRM_BTN'),
        accept: () => {
          this.removeMarker();
        },
      });

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

  private removeMarker() {
    this.markers = this.markers.filter((marker) => marker.id !== this.draggedMarker?.id);
    this.sortChange.emit(this.markers);

    this.draggedMarker = null;
  }
}
