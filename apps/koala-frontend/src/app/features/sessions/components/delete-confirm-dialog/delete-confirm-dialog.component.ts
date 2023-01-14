import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'koala-delete-confirm-dialog',
  templateUrl: './delete-confirm-dialog.component.html',
  styleUrls: [
    './delete-confirm-dialog.component.scss',
  ],
})
export class DeleteConfirmDialogComponent {
  @Input() name?: string;
  @Input() objectIdentifier?: any;
  @Output() confirm = new EventEmitter<any>();
  @Output() cancel = new EventEmitter<void>();

  showDialog = true;

  onCancel() {
    this.cancel.emit();
  }

  onDeleteConfirm() {
    this.confirm.emit(this.objectIdentifier);
  }
}
