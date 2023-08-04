import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { LocalizedDatePipe } from './localized-date.pipe';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ButtonModule } from 'primeng/button';

@NgModule({
  declarations: [
    LocalizedDatePipe,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ProgressSpinnerModule,
    ButtonModule,
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    LocalizedDatePipe,
    ProgressSpinnerModule,
    ButtonModule,
  ],
  providers: [
    DatePipe,
  ],
})
export class SharedModule {}
