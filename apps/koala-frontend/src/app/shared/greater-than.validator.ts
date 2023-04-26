import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export const markerRangeValueValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const valueRangeFrom: number = control.get('valueRangeFrom')?.value;
  const valueRangeTo: number = control.get('valueRangeTo')?.value;

  return valueRangeFrom > valueRangeTo ? { rangeValueError: true } : null;
};
