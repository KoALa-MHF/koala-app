import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ImprintPage } from './pages/imprint/imprint.page';
import { AboutPage } from './pages/about/about.page';

const routes: Routes = [
  { path: 'imprint', component: ImprintPage },
  { path: 'about', component: AboutPage },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
  ],
  exports: [
    RouterModule,
  ],
})
export class CoreRoutingModule {}
