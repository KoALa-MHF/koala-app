import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { LocalizedDatePipe } from './localized-date.pipe';

@NgModule({
  declarations: [
    LocalizedDatePipe,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    LocalizedDatePipe,
  ],
  providers: [
    DatePipe,
  ],
})
export class SharedModule {}
