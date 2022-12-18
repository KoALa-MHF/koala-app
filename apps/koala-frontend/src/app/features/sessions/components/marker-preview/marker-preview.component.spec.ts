import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarkerPreviewComponent } from './marker-preview.component';

describe('MarkerPreviewComponent', () => {
  let component: MarkerPreviewComponent;
  let fixture: ComponentFixture<MarkerPreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MarkerPreviewComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MarkerPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
