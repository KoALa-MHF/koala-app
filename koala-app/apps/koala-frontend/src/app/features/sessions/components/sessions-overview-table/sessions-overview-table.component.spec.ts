import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SessionsOverviewTableComponent } from './sessions-overview-table.component';

describe('SessionsOverviewTableComponent', () => {
  let component: SessionsOverviewTableComponent;
  let fixture: ComponentFixture<SessionsOverviewTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SessionsOverviewTableComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SessionsOverviewTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
