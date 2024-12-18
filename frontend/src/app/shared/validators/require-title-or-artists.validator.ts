import { AbstractControl, FormGroup, ValidationErrors } from '@angular/forms';

export function requireTitleOrArtists(control: AbstractControl): ValidationErrors | null {
  if (!control) {
    return null;
  }

  const formGroup: FormGroup = control as FormGroup;

  if (!formGroup) {
    return null;
  }

  const title: string = formGroup.get('title')?.value;
  const artists: string = formGroup.get('artists')?.value;

  if (!title && !artists) {
    return { required: true };
  }

  return null;
}
