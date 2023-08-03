import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MarkersOverviewPage } from './pages/markers-overview/markers-overview.page';

const routes: Routes = [
  { path: '', component: MarkersOverviewPage },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
  ],
  exports: [
    RouterModule,
  ],
})
export class MarkersRoutingModule {}
