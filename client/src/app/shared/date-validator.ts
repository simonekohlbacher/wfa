import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export class DateValidators {

  // rückgabe ist Validatorfunktion
  static endAfterStartValidator(): ValidatorFn {
    return (group: AbstractControl): ValidationErrors | null => {
      // bekommt eine form group, daraus werte holen
      const start = new Date(group.get('start_at')?.value);
      const end = new Date(group.get('end_at')?.value);
      if (start && end && end < start) {
        return { endBeforeStart: true };
      }
      return null;
    };
  }
}
