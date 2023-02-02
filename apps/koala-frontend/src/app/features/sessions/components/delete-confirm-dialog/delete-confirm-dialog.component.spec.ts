import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteConfirmDialogComponent } from './delete-confirm-dialog.component';

describe('DeleteConfirmDialogComponent', () => {
  let component: DeleteConfirmDialogComponent;
  let fixture: ComponentFixture<DeleteConfirmDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        DeleteConfirmDialogComponent,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DeleteConfirmDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
