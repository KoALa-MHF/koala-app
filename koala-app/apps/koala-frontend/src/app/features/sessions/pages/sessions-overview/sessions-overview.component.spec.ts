import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SessionsOverviewPage } from './sessions-overview.component';

describe('SessionsComponent', () => {
  let component: SessionsOverviewPage;
  let fixture: ComponentFixture<SessionsOverviewPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SessionsOverviewPage],
    }).compileComponents();

    fixture = TestBed.createComponent(SessionsOverviewPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
