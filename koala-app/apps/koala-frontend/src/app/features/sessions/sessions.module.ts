import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SessionsRoutingModule } from './sessions-routing.module';
import { SessionsComponent } from './components/sessions/sessions.component';

import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { SessionsService } from './services/sessions.service';

@NgModule({
  declarations: [SessionsComponent],
  imports: [
    CommonModule,
    SessionsRoutingModule,
    MatListModule,
    MatButtonModule,
    MatInputModule,
  ],
  providers: [SessionsService]
})
export class SessionsModule { }
