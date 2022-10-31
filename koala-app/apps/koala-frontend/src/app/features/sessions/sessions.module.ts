import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SessionsRoutingModule } from './sessions-routing.module';
import { SessionsComponent } from './components/sessions/sessions.component';
import { SessionsService } from './services/sessions.service';

//material modules
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from "@angular/material/table";
import { MatIconModule } from "@angular/material/icon";


@NgModule({
  declarations: [SessionsComponent],
  imports: [
    CommonModule,
    SessionsRoutingModule,
    MatButtonModule,
    MatInputModule,
    MatTableModule,
    MatIconModule
  ],
  providers: [SessionsService]
})
export class SessionsModule { }
