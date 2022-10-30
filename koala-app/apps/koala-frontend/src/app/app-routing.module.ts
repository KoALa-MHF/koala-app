import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './core/components/home/home.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent 
  },
  { 
    path: 'sessions',
    loadChildren: () => import('./features/sessions/sessions.module').then(m => m.SessionsModule) 
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
