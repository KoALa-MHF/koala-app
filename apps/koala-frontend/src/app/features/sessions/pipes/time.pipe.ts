import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'time',
})
export class TimePipe implements PipeTransform {
  transform(timeInSeconds: number): string {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    let secondsLabel;

    if (seconds < 10) {
      secondsLabel = '0' + seconds;
    } else {
      secondsLabel = seconds.toString();
    }

    return minutes + ':' + secondsLabel;
  }
}
