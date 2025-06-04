import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'roleLabel' })
export class RoleLabelPipe implements PipeTransform {
  transform(value: string): string {
    switch (value) {
      case 'teacher': return 'Tutor:in';
      case 'student': return 'Schüler:in';
      default: return value;
    }
  }
}
