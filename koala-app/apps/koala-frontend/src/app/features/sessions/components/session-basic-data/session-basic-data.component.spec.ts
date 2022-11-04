import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { SessionBasicDataComponent } from './session-basic-data.component';

describe('SessionBasicDataComponent', () => {
  let component: SessionBasicDataComponent;
  let fixture: ComponentFixture<SessionBasicDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SessionBasicDataComponent],
      imports: [MatFormFieldModule, MatInputModule, BrowserAnimationsModule]
    }).compileComponents();

    fixture = TestBed.createComponent(SessionBasicDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
