import { NgModule } from '@angular/core';

import { SessionsRoutingModule } from './sessions-routing.module';
import { SessionsOverviewPage } from './pages/sessions-overview/sessions-overview.page';
import { SessionsService } from './services/sessions.service';

//material modules
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';

import { SessionsOverviewTableComponent } from './components/sessions-overview-table/sessions-overview-table.component';
import { SessionCreatePage } from './pages/session-create/session-create.page';
import { SessionBasicDataComponent } from './components/session-basic-data/session-basic-data.component';
import { SharedModule } from '../../shared/shared.module';


@NgModule({
  declarations: [
    SessionsOverviewPage,
    SessionsOverviewTableComponent,
    SessionCreatePage,
    SessionBasicDataComponent,
  ],
  imports: [
    SharedModule,
    SessionsRoutingModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatIconModule
  ],
  providers: [SessionsService]
})
export class SessionsModule { }
