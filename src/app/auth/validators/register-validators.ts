import { ValidationErrors, AbstractControl, ValidatorFn } from "@angular/forms";

export class RegisterValidators {
  static match(controlName: string, matchingControlName: string): ValidatorFn {
    return (group: AbstractControl): ValidationErrors | null => {
      const control = group.get(controlName);
      const matchingControl = group.get(matchingControlName);

      if (!control || !matchingControl) {
        console.error("Form controls can not be found in the form group.");
        return { controlNotFound: false }
      };

      const error = control.value === matchingControl.value ? null : { noMatch: true };

      matchingControl.setErrors(error);

      return error;
    }
  }

  static egyptianMobile(control: AbstractControl): ValidationErrors | null {
    if (!control) {
      console.error("Form controls can not be found in the form group.");
      return { controlNotFound: false }
    };
    const regex = /^1[0125][0-9]{8}$/;

    const error = regex.test(control.value.replace(/-/g, "")) ? null : { EgyptianPhoneNumber: true };
    control.setErrors(error);

    return error;
  }
}
