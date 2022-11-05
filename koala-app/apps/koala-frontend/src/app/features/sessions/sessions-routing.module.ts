import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SessionCreatePage } from './pages/session-create/session-create.page';
import { SessionsOverviewPage } from './pages/sessions-overview/sessions-overview.page';

const routes: Routes = [
  { path: '', component: SessionsOverviewPage },
  { path: 'create', component: SessionCreatePage },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SessionsRoutingModule { }
