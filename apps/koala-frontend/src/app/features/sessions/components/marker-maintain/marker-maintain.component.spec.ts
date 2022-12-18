import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarkerMaintainComponent } from './marker-maintain.component';

describe('MarkerMaintainComponent', () => {
  let component: MarkerMaintainComponent;
  let fixture: ComponentFixture<MarkerMaintainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MarkerMaintainComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MarkerMaintainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
