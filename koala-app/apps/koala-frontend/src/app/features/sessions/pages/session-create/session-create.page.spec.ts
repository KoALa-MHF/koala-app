import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ApolloTestingController, ApolloTestingModule } from 'apollo-angular/testing';
import { SessionsModule } from '../../sessions.module';

import { SessionCreatePage } from './session-create.page';

describe('SessionCreateComponent', () => {
  let component: SessionCreatePage;
  let fixture: ComponentFixture<SessionCreatePage>;
  let server;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SessionCreatePage],
      imports: [ApolloTestingModule, SessionsModule, BrowserAnimationsModule]
    }).compileComponents();

    server = TestBed.inject(ApolloTestingController);

    fixture = TestBed.createComponent(SessionCreatePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
