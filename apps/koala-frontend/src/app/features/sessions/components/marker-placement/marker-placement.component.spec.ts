import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarkerPlacementComponent } from './marker-placement.component';

describe('MarkerPlacementComponent', () => {
  let component: MarkerPlacementComponent;
  let fixture: ComponentFixture<MarkerPlacementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MarkerPlacementComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MarkerPlacementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
