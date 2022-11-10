import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { SessionDetailsComponent } from './session-details.component';

describe('SessionDetailsComponent', () => {
  let component: SessionDetailsComponent;
  let fixture: ComponentFixture<SessionDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SessionDetailsComponent],
      imports: [
        MatFormFieldModule,
        MatCheckboxModule,
        BrowserAnimationsModule,
        FormsModule,
        ReactiveFormsModule,
        MatInputModule,
        MatDatepickerModule,
        MatNativeDateModule,
      ],
    }).compileComponents();

    const formBuilder = TestBed.inject(FormBuilder);

    fixture = TestBed.createComponent(SessionDetailsComponent);
    component = fixture.componentInstance;

    component.sessionDetailsForm = new FormGroup({
      editable: new FormControl<boolean>(false),
      start: new FormControl<Date | null>(null),
      end: new FormControl<Date | null>(null),
      player: new FormControl<boolean>(false),
      sampleSolution: new FormControl<boolean>(false),
      analysis: new FormControl<boolean>(false),
    });

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
