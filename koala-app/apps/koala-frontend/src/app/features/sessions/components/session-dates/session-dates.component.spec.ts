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

import { SessionDatesComponent } from './session-dates.component';

describe('SessionDatesComponent', () => {
  let component: SessionDatesComponent;
  let fixture: ComponentFixture<SessionDatesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SessionDatesComponent],
      imports: [
        MatFormFieldModule,
        MatCheckboxModule,
        BrowserAnimationsModule,
        FormsModule,
        ReactiveFormsModule,
        MatInputModule,
        MatDatepickerModule,
        MatNativeDateModule
      ],
    }).compileComponents();

    const formBuilder = TestBed.inject(FormBuilder);

    fixture = TestBed.createComponent(SessionDatesComponent);
    component = fixture.componentInstance;

    component.sessionDatesForm = new FormGroup({
      online: new FormControl<boolean>(false),
      start: new FormControl<Date | null>(null),
      end: new FormControl<Date | null>(null),
    });

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
