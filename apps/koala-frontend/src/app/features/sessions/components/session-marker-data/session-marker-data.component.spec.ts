import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SessionMarkerDataComponent } from './session-marker-data.component';

describe('SessionMarkerDataComponent', () => {
  let component: SessionMarkerDataComponent;
  let fixture: ComponentFixture<SessionMarkerDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SessionMarkerDataComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SessionMarkerDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
