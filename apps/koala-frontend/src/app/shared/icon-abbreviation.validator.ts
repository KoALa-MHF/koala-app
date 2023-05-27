import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { MarkerType } from '../graphql/generated/graphql';

export const iconAbbreviationValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const icon: string = control.get('icon')?.value;
  const abbreviation: string = control.get('abbreviation')?.value;

  return !icon && !abbreviation ? { bothEmpty: true } : null;
};
