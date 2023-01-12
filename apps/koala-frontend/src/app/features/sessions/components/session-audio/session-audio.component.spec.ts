import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { SessionAudioComponent } from './session-audio.component';

describe('SessionAudioComponent', () => {
  let component: SessionAudioComponent;
  let fixture: ComponentFixture<SessionAudioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        SessionAudioComponent,
      ],
      imports: [
        MatFormFieldModule,
        MatInputModule,
        MatRadioModule,
        BrowserAnimationsModule,
        FormsModule,
        ReactiveFormsModule,
      ],
    }).compileComponents();

    const formBuilder = TestBed.inject(FormBuilder);

    fixture = TestBed.createComponent(SessionAudioComponent);
    component = fixture.componentInstance;

    component.audioForm = new FormGroup({
      name: new FormControl<string>(''),
    });

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
