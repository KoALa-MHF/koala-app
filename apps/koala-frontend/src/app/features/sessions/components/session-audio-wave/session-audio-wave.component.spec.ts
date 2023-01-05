import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SessionAudioWaveComponent } from './session-audio-wave.component';

describe('SessionAudioWaveComponent', () => {
  let component: SessionAudioWaveComponent;
  let fixture: ComponentFixture<SessionAudioWaveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        SessionAudioWaveComponent,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SessionAudioWaveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
