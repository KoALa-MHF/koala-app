import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export const credentialsValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const username = control.get('username')?.value;
  const password = control.get('password')?.value;
  const sessionCode = control.get('sessionCode')?.value;

  const credentialsCheck = username !== '' && password !== '';
  const sessionCodeCheck = sessionCode !== '';

  let usernameMissing = false;
  let passwordMissing = false;

  if (sessionCodeCheck === false && credentialsCheck === false) {
    //general error
  } else if (username !== '' && password === '') {
    passwordMissing = true;
  } else if (password !== '' && username === '') {
    usernameMissing = true;
  }

  return (username !== '' && password !== '') || sessionCode !== ''
    ? null
    : { loginNotComplete: true, passwordMissing, usernameMissing };
};
