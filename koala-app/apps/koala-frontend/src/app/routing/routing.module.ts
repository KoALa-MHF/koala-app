import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Routes, RouterModule } from '@angular/router';
import { SessionsComponent } from '../sessions/sessions.component';

const routes: Routes = [
    { path: 'sessions', component: SessionsComponent },
    { path: '', redirectTo: 'sessions', pathMatch: 'full'}
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class RoutingModule { }
