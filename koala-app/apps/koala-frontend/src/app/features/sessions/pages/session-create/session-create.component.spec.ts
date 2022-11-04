import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SessionCreatePage } from './session-create.component';

describe('SessionCreateComponent', () => {
  let component: SessionCreatePage;
  let fixture: ComponentFixture<SessionCreatePage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SessionCreatePage],
    }).compileComponents();

    fixture = TestBed.createComponent(SessionCreatePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
