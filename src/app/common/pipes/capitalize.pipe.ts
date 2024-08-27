import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "capitalize",
})
export class CapitalizePipe implements PipeTransform {
  transform(value: string, capitalize: boolean = false): string {
    if (!value) return "";
    if (!capitalize) return value;
    // Split the string into words
    const words = value.split(" ");

    // Capitalize the first letter of each word
    const capitalizedWords = words.map((word) => {
      if (word.length === 0) {
        return word; // Return empty strings as is
      } else {
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
      }
    });

    // Join the capitalized words back together
    return capitalizedWords.join(" ");
  }
}
