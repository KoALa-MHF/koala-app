import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SessionParticipantsInvitationComponent } from './session-participants-invitation.component';

describe('SessionParticipantsInvitationComponent', () => {
  let component: SessionParticipantsInvitationComponent;
  let fixture: ComponentFixture<SessionParticipantsInvitationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SessionParticipantsInvitationComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SessionParticipantsInvitationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
