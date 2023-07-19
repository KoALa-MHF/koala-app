import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './features/auth/guards/auth.guard';
import { LayoutComponent } from './layout.component';
import { ImprintPage } from './core/pages/imprint/imprint.page';
import { AboutPage } from './core/pages/about/about.page';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'sessions',
    pathMatch: 'full',
  },
  {
    path: '',
    loadChildren: () => import('./core/core.module').then((m) => m.CoreModule),
  },
  {
    path: 'sessions',
    component: LayoutComponent,
    loadChildren: () => import('./features/sessions/sessions.module').then((m) => m.SessionsModule),
    canActivate: [
      AuthGuard,
    ],
  },
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.module').then((m) => m.AuthModule),
  },
  {
    path: '**',
    redirectTo: 'sessions',
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes),
  ],
  exports: [
    RouterModule,
  ],
})
export class AppRoutingModule {}
