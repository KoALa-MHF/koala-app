import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SessionMaintainPage } from './pages/session-maintain/session-maintain.page';
import { SessionsOverviewPage } from './pages/sessions-overview/sessions-overview.page';
import { SessionPage } from './pages/session/session.page';
import { SessionInfoPage } from './pages/session-info/session-info.page';
import { SessionAnalysisPage } from './pages/session-analysis/session-analysis.page';

const routes: Routes = [
  { path: '', component: SessionsOverviewPage },
  { path: 'create', component: SessionMaintainPage },
  { path: 'update/:sessionId', component: SessionMaintainPage },
  { path: ':sessionId', component: SessionPage },
  { path: ':sessionId/info', component: SessionInfoPage },
  { path: ':sessionId/analysis', component: SessionAnalysisPage },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
  ],
  exports: [
    RouterModule,
  ],
})
export class SessionsRoutingModule {}
