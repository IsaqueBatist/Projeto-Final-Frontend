import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'mask',
  standalone: false
})
export class MaskPipe implements PipeTransform {

  transform(value: string, pattern: string): string {
    if (!value || !pattern) return value;

    let result = '';
    let valueIndex = 0;

    for (let i = 0; i < pattern.length; i++) {
      if (valueIndex >= value.length) break;

      if (pattern[i] === '9') {
        if (/\d/.test(value[valueIndex])) {
          result += value[valueIndex++];
        } else {
          valueIndex++;
          i--;
        }
      } else {
        result += pattern[i];
      }
    }

    return result;
  }

}
