import { Component, Input, AfterViewInit, OnChanges, SimpleChanges } from '@angular/core';
import { Marker } from '../../types/marker.entity';
import { MarkerService } from '../../services/marker.service';
import * as d3 from 'd3';

export enum Display {
  Rect = 'rect',
  Circle = 'circle',
}

export interface DataPoint {
  id: number;
  strength: number;
  disply: Display;
  startTime: number;
  endTime: number;
  color: string;
}

@Component({
  selector: 'koala-app-annotation',
  templateUrl: './annotation.component.html',
  styleUrls: [
    './annotation.component.scss',
    '../../session-common.scss',
  ],
})
export class AnnotationComponent implements AfterViewInit, OnChanges {
  @Input() annotationData: Map<number, Array<DataPoint>> = new Map<number, Array<DataPoint>>();
  @Input() totalTime = 1;
  @Input() currentTime = 0;
  @Input() markers: Marker[] = [];

  private annotationStrength = 5;
  private containerID = 'd3-container';
  private labelsID = 'd3-labels';

  constructor(private readonly markerService: MarkerService) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes) {
      if (changes['currentTime']) {
        this.drawTimeline();
        let row = 1;
        this.annotationData.forEach((_, id) => {
          this.drawAnnotations(id, row);
          row++;
        });
      }
      if (changes['markers']) {
        if (this.markers.length == 0) {
          return;
        }
        this.setContainerHeight();
        this.drawLines();
        this.drawTimeline();
      }
    }
  }

  ngAfterViewInit() {
    this.drawTimeline();
  }

  public addDataPoint(id: number, value: DataPoint) {
    const points = this.annotationData.get(id);
    points?.push(value);
  }

  private drawLines() {
    this.markerService.getIconByCode('');
    const svgC = d3.select(`svg#${this.containerID}`);
    const svgL = d3.select(`svg#${this.labelsID}`);

    const text = svgL.selectAll('text,foreignObject').data(this.markers);
    const gRow = svgC.selectAll('g').data(this.markers);
    const line = svgC.selectAll('line.marker').data(this.markers);

    text.style('visibility', (m: Marker) => (m.hidden ? 'hidden' : 'visible'));
    text.enter().each((m: Marker, i: number, elements: any) => {
      this.drawLineText(m, elements[i]);
    });
    gRow.style('visibility', (m: Marker) => (m.hidden ? 'hidden' : 'visible'));
    gRow
      .enter()
      .append('g')
      .attr('id', (m: Marker) => 'row_' + m.id);
    line.style('visibility', (m: Marker) => (m.hidden ? 'hidden' : 'visible'));
    line
      .enter()
      .append('line')
      .style('stroke', 'black')
      .attr('class', 'marker')
      .attr('x1', 5)
      .attr('x2', this.getContainerWidth())
      .attr('y1', (m: Marker) => this.getPositionY(m.id))
      .attr('y2', (m: Marker) => this.getPositionY(m.id));
  }

  private drawLineText(m: Marker, element: any) {
    const height = this.getPositionY(m.id);
    element = d3
      .select(element)
      .append('svg:foreignObject')
      .attr('width', '30px')
      .attr('height', '30px')
      .attr('y', height - 10)
      .attr('id', `marker_text${m.id}`);
    if (m.icon) {
      const icon = this.markerService.getIconByCode(m.icon);
      element.attr('font-family', 'primeicons');
      if ((icon && icon.source === 'noto') || (icon && icon.source === 'noto_emoji')) {
        element.html(icon?.code || '').style('font-size', 'x-large');
      } else {
        element.attr('class', `pi pi-${icon?.code}`);
      }
    } else {
      element.text(m.abbreviation || '');
    }
  }

  private drawAnnotations(id: number, row: number) {
    console.log('drawing annotations');
    const svg = d3.select(`svg#${this.containerID}`);
    const trans = svg.transition().duration(50);
    const posY = this.getPositionY(row);
    const rowElem = svg.select('g#row_' + id);
    rowElem
      .selectAll<SVGRectElement, DataPoint>('*')
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      .data<DataPoint>(this.annotationData.get(id)!)
      .join(
        (enter) =>
          enter
            .append((d: DataPoint) => {
              return document.createElementNS(d3.namespaces['svg'], d.disply);
            })
            .attr('x', (d: DataPoint) => this.getPositionXRatio() * d.startTime)
            .attr('y', (d: DataPoint) => this.getRectPositionY(d, posY))
            .attr('cx', (d: DataPoint) => this.getPositionXRatio() * d.startTime)
            .attr('cy', posY)
            .attr('r', 5)
            .attr('width', (d: DataPoint) => this.getRectWidth(d.startTime, d.endTime))
            .attr('height', (d: DataPoint) => this.getRectHeight(d))
            .attr('id', (d: DataPoint) => `row_${row}_${d.id}`)
            .attr('fill', (d: DataPoint) => d.color)
            .on('mouseover', (ev, d) => d3.select(ev.srcElement).transition().duration(10).attr('fill', 'black'))
            .on('mouseout', (ev, d) => d3.select(ev.srcElement).transition().duration(10).attr('fill', d.color)),
        (update) =>
          update.call((update) =>
            update.transition(trans).attr('width', (d: DataPoint) => this.getRectWidth(d.startTime, d.endTime))
          ),
        (exit) => exit.call((update) => update.transition(trans).attr('width', 0).attr('height', 0).remove())
      );
  }

  private drawTimeline() {
    const line = d3.select(`svg#${this.containerID}`).selectAll('line#timeline').data<number>([
      this.currentTime,
    ]);

    let time = 2;
    if (this.getPositionXRatio() !== Infinity) {
      time = this.currentTime * this.getPositionXRatio() < 2 ? 2 : this.currentTime * this.getPositionXRatio();
    }

    line.attr('x1', time);
    line.attr('x2', time);
    line.attr('y1', this.getPositionY(0));
    line.attr('y2', this.getPositionY(this.markers.length) + 20);

    line
      .enter()
      .append('line')
      .style('stroke', 'rgba(73, 157, 255, 0.95)')
      .attr('id', 'timeline')
      .attr('stroke-width', 2);
  }

  private getPositionXRatio() {
    const w = this.getContainerWidth();
    return w / this.totalTime;
  }

  private getPositionY(id: number) {
    const h = this.getContainerHeight() - 10;
    const r = h / this.markers.length;
    return r * (id - 1) + r / 2;
  }

  private getRectHeight(d: DataPoint) {
    if (d.strength == 0) {
      return this.annotationStrength;
    }
    return Math.abs(d.strength) * this.annotationStrength;
  }

  private getRectPositionY(d: DataPoint, posY: number) {
    if (d.strength < 0) {
      return posY;
    }
    if (d.strength != 0) {
      return posY + d.strength * this.annotationStrength * -1;
    }
    return posY - 2.5;
  }

  private getRectWidth(start: number, end: number) {
    if (end == 0) {
      const w = Math.abs(this.currentTime - start) * this.getPositionXRatio();
      return w.toFixed(1);
    }
    return Math.abs(end - start) * this.getPositionXRatio();
  }

  public onResize() {
    const svgC = d3.select(`svg#${this.containerID}`);
    const svgL = d3.select(`svg#${this.labelsID}`);
    svgC.selectAll('rect').remove();
    svgC.selectAll('circle').remove();
    svgC.selectAll('line.marker').remove();
    svgL.selectAll('text').remove();
    this.drawLines();
    this.drawTimeline();
    let row = 1;
    this.annotationData.forEach((_, id) => {
      this.drawAnnotations(id, row);
      row++;
    });
  }

  private getContainerWidth() {
    const container = document.getElementById(this.containerID);
    if (container) {
      return container.getBoundingClientRect().width;
    }
    return 500;
  }

  private getContainerHeight() {
    const container = document.getElementById(this.containerID);
    if (container) {
      return container.getBoundingClientRect().height;
    }
    return this.markers.length * 60;
  }

  private setContainerHeight() {
    const container = document.getElementById(this.containerID);
    if (container) {
      container.style.height = this.markers.length * 40 + 'px';
    }
  }
}
