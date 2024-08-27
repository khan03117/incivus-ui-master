// custom-validators.ts
import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

// Validator to check word count
export function wordCountValidator(wordLimit: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const words = control.value.trim().split(/\s+/);
    if (words.length > wordLimit) {
      return { wordLimitExceeded: true };
    }
    return null;
  };
}

// Validator to check at least one entry in an array
export function atLeastOneEntryValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (Array.isArray(value) && value.length > 0) {
      return null; // No error
    }
    return { atLeastOneEntry: true }; // Error
  };
}

export function isImage(file: File): boolean {
  return file.type.startsWith("image");
}

export function isVideo(file: File): boolean {
  return file.type.startsWith("video");
}
export function isOtherType(file: File): boolean {
  return !file.type.startsWith("video") && !file.type.startsWith("image");
}

export function futureDateValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    console.log("control values", control);

    if (control.value == null || control.value == "") return null;
    const selectedDate = new Date(control.value);
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0); // Set current date to start of day

    return selectedDate >= currentDate ? null : { pastDate: true };
  };
}
