import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SessionMaintainPage } from './pages/session-maintain/session-maintain.page';
import { SessionsOverviewPage } from './pages/sessions-overview/sessions-overview.page';
import { SessionPage } from './pages/session/session.page';
import { SessionInfoPage } from './pages/session-info/session-info.page';
import { SessionAnalysisPage } from './pages/session-analysis/session-analysis.page';
import { sessionOpenGuard } from './guards/session-open.guard';
import { UnsavedChangesGuard } from './guards/session-unsaved-changes.guard';
import { SessionNotFoundPage } from './pages/session-not-found/session-not-found.page';
import { SessionNotActivePage } from './pages/session-not-active/session-not-active.page';

const routes: Routes = [
  { path: '', component: SessionsOverviewPage },
  { path: 'not-found', component: SessionNotFoundPage },
  { path: 'not-active', component: SessionNotActivePage },
  { path: 'create', component: SessionMaintainPage },
  { path: 'update/:sessionId', component: SessionMaintainPage },
  {
    path: ':sessionId',
    component: SessionPage,
    canActivate: [
      sessionOpenGuard,
    ],
    canDeactivate: [
      UnsavedChangesGuard,
    ],
  },
  {
    path: ':sessionId/info',
    component: SessionInfoPage,
    canActivate: [
      sessionOpenGuard,
    ],
  },
  {
    path: ':sessionId/analysis',
    component: SessionAnalysisPage,
    canActivate: [
      sessionOpenGuard,
    ],
  },
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
