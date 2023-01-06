import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';

import { ApolloModule, APOLLO_OPTIONS } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { InMemoryCache } from '@apollo/client/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { CoreModule } from './core/core.module';

import { environment } from '../environments/environment';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    ApolloModule,
    CoreModule,
    BrowserAnimationsModule,
    AppRoutingModule,
  ],
  providers: [
    {
      provide: APOLLO_OPTIONS,
      useFactory(httpLink: HttpLink) {
        const uri: string = environment.production ? 'https://koala-app.de/graphql' : 'http://localhost:4200/graphql';
        return {
          cache: new InMemoryCache(),
          link: httpLink.create({
            uri: uri,
          }),
        };
      },
      deps: [
        HttpLink,
      ],
    },
  ],
  bootstrap: [
    AppComponent,
  ],
})
export class AppModule {}
