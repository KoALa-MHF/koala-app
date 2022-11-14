import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { SessionBasicDataComponent } from './session-basic-data.component';

describe('SessionBasicDataComponent', () => {
  let component: SessionBasicDataComponent;
  let fixture: ComponentFixture<SessionBasicDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SessionBasicDataComponent],
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

    fixture = TestBed.createComponent(SessionBasicDataComponent);
    component = fixture.componentInstance;

    component.basicDataForm = new FormGroup({
      sessionName: new FormControl<string>('', [Validators.required]),
      sessionDescription: new FormControl<string>(''),
      sessionType: new FormControl<string>('1', [Validators.required]),
    });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
