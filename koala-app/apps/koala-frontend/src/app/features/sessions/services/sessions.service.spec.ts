import { TestBed } from '@angular/core/testing';
import { ApolloModule } from 'apollo-angular';
import { ApolloTestingController, ApolloTestingModule } from 'apollo-angular/testing';

import { SessionsService } from './sessions.service';

describe('SessionsService', () => {
  let service: SessionsService;
  let server;

  beforeEach(() => {
    TestBed.configureTestingModule({
         imports: [ApolloTestingModule]
    });

    server = TestBed.inject(ApolloTestingController);
    service = TestBed.inject(SessionsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
