import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export const datesStartEndValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const startDate: Date = control.get('start')?.value;
  const endDate: Date = control.get('end')?.value;

  if (startDate && endDate) {
    return startDate <= endDate ? null : { datesWrong: true };
  } else if (startDate || endDate) {
    return { datesNotCompleted: true };
  } else {
    return null;
  }
};
