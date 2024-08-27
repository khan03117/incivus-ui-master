import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "counter",
})
export class CounterPipe implements PipeTransform {
  transform(value: number): string {
    if (value === null) return "";
    if (value === 0) return "0";

    const suffixes = ["K", "M", "B", "T"];
    const intValue = Math.floor(value);
    const suffixIndex = Math.floor(("" + intValue).length / 3) - 1;
    console.log(
      `counter.pipe transform value:${value} suffixIndex:${suffixIndex}`
    );

    if (suffixIndex < 0) return value.toString();

    const shortValue = parseFloat(
      (value / Math.pow(1000, suffixIndex + 1)).toPrecision(2)
    );

    return shortValue + suffixes[suffixIndex];
  }
}
