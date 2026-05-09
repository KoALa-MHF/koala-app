import {
  Component,
  Input,
  OnChanges,
  AfterViewInit,
  ElementRef,
  ViewChild,
  HostListener,
  ChangeDetectorRef,
} from '@angular/core';

interface TimelineTick {
  x: number;
  label: string;
}

@Component({
  selector: 'koala-video-timeline',
  templateUrl: './video-timeline.component.html',
  styleUrls: [
    './video-timeline.component.scss',
  ],
})
export class VideoTimelineComponent implements OnChanges, AfterViewInit {
  @Input() totalTime = 0;
  @Input() currentTime = 0;

  @ViewChild('container') containerRef!: ElementRef<HTMLDivElement>;

  ticks: TimelineTick[] = [];
  cursorX = 0;
  svgWidth = 0;

  private readonly TICK_INTERVAL_SECONDS = 30;
  private readonly MIN_LABEL_SPACING_PX = 50;

  constructor(private readonly cdr: ChangeDetectorRef) {}

  ngAfterViewInit() {
    this.updateLayout();
    this.cdr.detectChanges();
  }

  ngOnChanges() {
    this.updateLayout();
  }

  @HostListener('window:resize')
  onResize() {
    this.updateLayout();
  }

  private updateLayout() {
    if (!this.containerRef?.nativeElement) return;
    this.svgWidth = this.containerRef.nativeElement.getBoundingClientRect().width;
    this.buildTicks();
    this.updateCursor();
  }

  private buildTicks() {
    this.ticks = [];
    if (this.totalTime <= 0 || this.svgWidth <= 0) return;

    const pixelsPerSecond = this.svgWidth / this.totalTime;
    const tickPx = this.TICK_INTERVAL_SECONDS * pixelsPerSecond;
    // Only show a label at every N-th tick so labels never overlap
    const labelEvery = tickPx < this.MIN_LABEL_SPACING_PX ? Math.ceil(this.MIN_LABEL_SPACING_PX / tickPx) : 1;

    let index = 0;
    for (let t = 0; t <= this.totalTime; t += this.TICK_INTERVAL_SECONDS, index++) {
      this.ticks.push({
        x: Math.round(t * pixelsPerSecond),
        label: index % labelEvery === 0 ? this.formatTime(t) : '',
      });
    }
  }

  private updateCursor() {
    if (this.totalTime <= 0 || this.svgWidth <= 0) {
      this.cursorX = 0;
      return;
    }
    const raw = (this.currentTime / this.totalTime) * this.svgWidth;
    this.cursorX = Math.min(Math.max(raw, 1), this.svgWidth - 1);
  }

  private formatTime(seconds: number): string {
    const m = Math.floor(seconds / 60);
    const s = Math.round(seconds % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  }
}
