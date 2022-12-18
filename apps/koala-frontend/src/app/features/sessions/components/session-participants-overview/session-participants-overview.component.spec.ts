import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SessionParticipantsOverviewComponent } from './session-participants-overview.component';

describe('SessionParticipantsOverviewComponent', () => {
  let component: SessionParticipantsOverviewComponent;
  let fixture: ComponentFixture<SessionParticipantsOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SessionParticipantsOverviewComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SessionParticipantsOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
