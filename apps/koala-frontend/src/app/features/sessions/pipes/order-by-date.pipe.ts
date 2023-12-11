import { Pipe, PipeTransform } from '@angular/core';
import { Comment } from '../types/comment.entity';

@Pipe({
  name: 'orderByDate',
})
export class OrderByDatePipe implements PipeTransform {
  transform(value?: Comment[] | null, order: 'asc' | 'desc' = 'asc'): Comment[] {
    if (value) {
      return value.sort((a, b) => {
        if (order === 'asc') {
          return a.createdAt > b.createdAt ? 1 : -1;
        } else if (order === 'desc') {
          return a.createdAt > b.createdAt ? -1 : 1;
        }
        return 0;
      });
    } else {
      return [];
    }
  }
}
