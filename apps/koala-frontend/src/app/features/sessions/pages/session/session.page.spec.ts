import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ApolloTestingController, ApolloTestingModule } from 'apollo-angular/testing';
import { SessionsModule } from '../../sessions.module';

import { SessionPage } from './session.page';

describe('SessionCreateComponent', () => {
  let component: SessionPage;
  let fixture: ComponentFixture<SessionPage>;
  let server;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        SessionPage,
      ],
      imports: [
        ApolloTestingModule,
        SessionsModule,
        BrowserAnimationsModule,
      ],
    }).compileComponents();

    server = TestBed.inject(ApolloTestingController);

    fixture = TestBed.createComponent(SessionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
