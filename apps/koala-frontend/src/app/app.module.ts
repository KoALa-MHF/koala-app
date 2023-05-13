import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { WebSocketLink } from '@apollo/client/link/ws';

import { ApolloModule, APOLLO_OPTIONS } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { InMemoryCache, split } from '@apollo/client/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { CoreModule } from './core/core.module';

import { environment } from '../environments/environment';

import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { SharedModule } from './shared/shared.module';
import { AuthModule } from './features/auth/auth.module';
import { LayoutComponent } from './layout.component';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { AuthInterceptor } from './features/auth/http-interceptors/auth-interceptor';
import { getMainDefinition } from '@apollo/client/utilities';
import { OperationDefinitionNode } from 'graphql';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

@NgModule({
  declarations: [
    AppComponent,
    LayoutComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    ApolloModule,
    CoreModule,
    SharedModule,
    AuthModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [
          HttpClient,
        ],
      },
    }),
    ToastModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    {
      provide: APOLLO_OPTIONS,
      useFactory(httpLink: HttpLink) {
        // Create a WebSocket link:
        const ws = new WebSocketLink({
          uri: 'ws://localhost:3333/graphql',
          options: {
            reconnect: true,
            connectionParams: () => {
              return { param1: 'Param1' };
            },
          },
        });

        const uri: string = environment.baseUrl + '/graphql';
        const http = httpLink.create({
          uri: uri,
        });

        const link = split(
          // split based on operation type
          ({ query }) => {
            const { kind, operation } = getMainDefinition(query) as OperationDefinitionNode;
            return kind === 'OperationDefinition' && operation === 'subscription';
          },
          ws,
          http
        );

        return {
          cache: new InMemoryCache(),
          link: link,
        };
      },
      deps: [
        HttpLink,
      ],
    },
    MessageService,
  ],
  bootstrap: [
    AppComponent,
  ],
})
export class AppModule {}
