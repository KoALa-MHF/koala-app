import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SessionBasicDataComponent } from './session-basic-data.component';

describe('SessionBasicDataComponent', () => {
  let component: SessionBasicDataComponent;
  let fixture: ComponentFixture<SessionBasicDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SessionBasicDataComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SessionBasicDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
