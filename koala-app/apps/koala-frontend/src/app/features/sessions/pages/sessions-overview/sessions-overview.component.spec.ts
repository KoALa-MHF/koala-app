import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ApolloModule } from 'apollo-angular';
import { SessionsModule } from '../../sessions.module';

import { SessionsOverviewPage } from './sessions-overview.component';

import { ApolloTestingController, ApolloTestingModule } from "apollo-angular/testing";

describe('SessionsComponent', () => {
  let component: SessionsOverviewPage;
  let fixture: ComponentFixture<SessionsOverviewPage>;
  let server;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SessionsOverviewPage],
      imports: [ApolloTestingModule, SessionsModule]
    }).compileComponents();

    server = TestBed.inject(ApolloTestingController);

    fixture = TestBed.createComponent(SessionsOverviewPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
