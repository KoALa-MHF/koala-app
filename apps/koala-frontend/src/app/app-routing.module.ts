import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './features/auth/guards/auth.guard';
import { LayoutComponent } from './layout.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'sessions',
    pathMatch: 'full',
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
    path: 'markers',
    component: LayoutComponent,
    loadChildren: () => import('./features/markers/markers.module').then((m) => m.MarkersModule),
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
