import { Pipe, PipeTransform } from '@angular/core';
import { Marker } from '../../types/marker.entity';

@Pipe({
  name: 'visibleFilter',
})
export class VisibleFilterPipe implements PipeTransform {
  transform(value: Marker[]): any {
    return value.filter((v) => {
      return v.visible === true;
    });
  }
}
