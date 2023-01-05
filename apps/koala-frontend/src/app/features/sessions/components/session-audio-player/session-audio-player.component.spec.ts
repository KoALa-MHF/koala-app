import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SessionAudioPlayerComponent } from './session-audio-player.component';

describe('SessionAudioPlayerComponent', () => {
  let component: SessionAudioPlayerComponent;
  let fixture: ComponentFixture<SessionAudioPlayerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        SessionAudioPlayerComponent,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SessionAudioPlayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
