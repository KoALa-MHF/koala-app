import { Component, Input, AfterViewInit, OnChanges, SimpleChanges } from '@angular/core';
import { Marker } from '../../types/marker.entity';
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
  providers: [],
})
export class AnnotationComponent implements AfterViewInit, OnChanges {
  @Input() annotationData: Map<number, Array<DataPoint>> = new Map<number, Array<DataPoint>>();
  @Input() totalTime = 1;
  @Input() currentTime = 0;
  @Input() markers: Marker[] = [];

  private annotationStrength = 5;
  private containerID = 'd3-container';
  private labelsID = 'd3-labels';

  ngOnChanges(changes: SimpleChanges) {
    if (changes) {
      if (changes['currentTime']) {
        let row = 1;
        this.annotationData.forEach((_, id) => {
          this.drawAnnotations(id, row);
          row++;
        });
      }
      if (changes['markers']) {
        this.drawLines();
      }
    }
  }

  ngAfterViewInit() {
    this.drawLines();
  }

  public addDataPoint(id: number, value: DataPoint) {
    const points = this.annotationData.get(id);
    points?.push(value);
  }

  private drawLines() {
    const svgC = d3.select(`svg#${this.containerID}`);
    const svgL = d3.select(`svg#${this.labelsID}`);
    this.markers.forEach((marker, i) => {
      svgC.append('g').attr('id', 'row_' + (i + 1));
      const text = marker.abbreviation || '';
      const height = this.getPositionY(i + 1);
      svgL.append('text').attr('y', height).text(text);
      svgC
        .append('line')
        .style('stroke', 'black')
        .attr('x1', 5)
        .attr('x2', this.getContainerWidth())
        .attr('y1', height)
        .attr('y2', height);
    });
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

  private getPositionXRatio() {
    const w = this.getContainerWidth();
    return w / this.totalTime;
  }

  private getPositionY(id: number) {
    const h = this.getContainerHeight() - 10;
    const r = h / this.markers.length;
    return (r / 2) * id;
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
    svgC.selectAll('line').remove();
    svgL.selectAll('text').remove();
    this.drawLines();
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
    return 500;
  }
}
