import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ToastModule,
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ToastModule,
  ],
  providers: [
    MessageService,
  ],
})
export class SharedModule {}
