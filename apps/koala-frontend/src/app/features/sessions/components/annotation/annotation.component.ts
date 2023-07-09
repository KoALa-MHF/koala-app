import { Component, Input, AfterViewInit, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
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
  display: Display;
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
  @Input() annotationData?: Map<number, Array<DataPoint>> = new Map<number, Array<DataPoint>>();
  @Input() totalTime = 1;
  @Input() currentTime = 0;
  @Input() markers: Marker[] = [];
  @Input() d3ContainerID = 0;
  @Input() displayMode = false;

  @Output() deleteAnnotations = new EventEmitter<Marker>();

  private annotationStrength = 2.5;
  d3Container = 'd3-container-';
  d3Labels = 'd3-labels-';
  d3tooltip: any;

  constructor(private readonly markerService: MarkerService) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes) {
      if (changes['markers']) {
        if (this.markers.length == 0) {
          return;
        }
        this.setContainerHeight();
        this.drawTimeline();
        this.drawLines();
      }
      if (changes['currentTime'] || changes['annotationData']) {
        this.drawTimeline();
        let i = 0;
        this.annotationData?.forEach((_, row) => {
          this.drawAnnotations(row, i);
          i++;
        });
      }
    }
  }

  ngAfterViewInit() {
    this.drawTimeline();
  }

  public addDataPoint(id: number, value: DataPoint) {
    const points = this.annotationData?.get(id);
    points?.push(value);
  }

  private drawLines() {
    const svgC = d3.select(`svg#${this.d3Container}${this.d3ContainerID}`);
    const svgL = d3.select(`svg#${this.d3Labels}${this.d3ContainerID}`);
    const text = svgL.selectAll('text,foreignObject').data(this.markers);
    const gRow = svgC.selectAll('g').data(this.markers);
    const line = svgC.selectAll('line.marker').data(this.markers);

    text.style('visibility', (m: Marker) => (m.visible ? 'visible' : 'hidden'));
    text.enter().each((m: Marker, i: number, elements: any) => {
      this.drawLineText(m, elements[i], i);
    });
    gRow.style('visibility', (m: Marker) => (m.visible ? 'visible' : 'hidden'));
    gRow
      .enter()
      .append('g')
      .attr('id', (m: Marker) => 'row_' + m.id);
    line.style('visibility', (m: Marker) => (m.visible ? 'visible' : 'hidden'));
    line
      .enter()
      .append('line')
      .style('stroke', 'black')
      .attr('class', 'marker')
      .attr('stroke-width', 1)
      .attr('x1', 1)
      .attr('x2', this.getContainerWidth())
      .attr('y1', (m: Marker, index: number) => this.getPositionY(index))
      .attr('y2', (m: Marker, index: number) => this.getPositionY(index))
      .attr('visibility', (m: Marker) => (m.visible ? 'visible' : 'hidden'));
  }

  private drawLineText(m: Marker, element: any, index: number) {
    const height = this.getPositionY(index);
    element = d3
      .select(element)
      .append('svg:foreignObject')
      .attr('width', '30px')
      .attr('height', '30px')
      .attr('y', height - 10)
      .attr('id', `marker_text${index}`)
      .attr('visibility', m.visible ? 'visible' : 'hidden');
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

  private drawAnnotations(row: number, index: number) {
    const svg = d3.select(`svg#${this.d3Container}${this.d3ContainerID}`);
    const trans = svg.transition().duration(50);
    const posY = this.getPositionY(index);
    const rowElem = svg.select('g#row_' + row);
    const mouseover = (d: any, ev: any) => {
      this.drawToolTip().style('opacity', 1);
      d3.select(ev.target).style('stroke', 'black').style('opacity', 1);
    };
    const mousemove = (d: any, ev: any) => {
      const htmlText = d.endTime ? `${d.startTime}s - ${d.endTime}s` : `${d.startTime}s`;
      this.drawToolTip()
        .html(htmlText)
        .style('left', d3.pointer(ev, ev.target)[0] + 50 + 'px')
        .style('top', d3.pointer(ev, ev.target)[1] + 'px');
    };
    const mouseleave = (d: any, ev: any) => {
      this.drawToolTip().style('opacity', 0).html('');
      d3.select(ev.target).style('stroke', 'none').style('opacity', 1);
    };
    rowElem
      .selectAll<SVGRectElement, DataPoint>('*')
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      .data<DataPoint>(this.annotationData!.get(row)!)
      .join(
        (enter) =>
          enter
            .append((d: DataPoint) => {
              return document.createElementNS(d3.namespaces['svg'], d.display);
            })
            .attr('x', (d: DataPoint) => this.getPositionXRatio() * d.startTime)
            .attr('y', (d: DataPoint) => this.getRectPositionY(d, posY))
            .attr('cx', (d: DataPoint) => this.getPositionXRatio() * d.startTime)
            .attr('cy', posY)
            .attr('r', 5)
            .attr('width', (d: DataPoint) => this.getRectWidth(d))
            .attr('height', (d: DataPoint) => this.getRectHeight(d))
            .attr('id', (d: DataPoint) => `row_${row}_${d.id}`)
            .attr('fill', (d: DataPoint) => d.color)
            .on('mousemove', (ev, d) => mousemove(d, ev))
            .on('mouseleave', (ev, d) => mouseleave(d, ev))
            .on('mouseover', (ev, d) => mouseover(d, ev)),
        (update) =>
          update.call((update) => update.transition(trans).attr('width', (d: DataPoint) => this.getRectWidth(d))),
        (exit) => exit.call((update) => update.transition(trans).attr('width', 0).attr('height', 0).remove())
      );
    rowElem.raise();
  }

  private drawTimeline() {
    const line = d3.select(`svg#${this.d3Container}${this.d3ContainerID}`).selectAll('line#timeline').data<number>([
      this.currentTime,
    ]);

    let time = 1;
    if (this.getPositionXRatio() !== Infinity) {
      time = this.currentTime * this.getPositionXRatio() < 1 ? 1 : this.currentTime * this.getPositionXRatio();
    }

    line.attr('x1', time);
    line.attr('x2', time);
    line.attr('y1', this.getPositionY(0) - 100);
    line.attr('y2', this.getPositionY(this.markers.length));

    line
      .enter()
      .append('line')
      .style('stroke', 'rgba(73, 157, 255, 0.95)')
      .attr('id', 'timeline')
      .attr('stroke-width', 2);
  }

  private drawToolTip() {
    if (this.d3tooltip) {
      return this.d3tooltip;
    }
    return (this.d3tooltip = d3
      .select(`div#${this.d3Container}${this.d3ContainerID}`)
      .append('div')
      .style('opacity', 0)
      .style('position', 'absolute')
      .style('background-color', 'white')
      .style('border', 'solid')
      .style('border-width', '2px')
      .style('border-radius', '5px')
      .style('padding', '5px')
      .attr('id', 'tooltip'));
  }

  private getPositionXRatio() {
    const w = this.getContainerWidth();
    return w / this.totalTime;
  }

  private getPositionY(id: number) {
    const h = this.getContainerHeight() - 10;
    const r = h / this.markers.length;
    return r * id + r / 2;
  }

  private getRectHeight(d: DataPoint) {
    if (!d.strength || d.strength == 0) {
      return 2;
    }
    return Math.abs(d.strength) * this.annotationStrength;
  }

  private getRectPositionY(d: DataPoint, posY: number) {
    if (!d.strength) {
      return posY - 1;
    }
    if (d.strength < 0) {
      return posY;
    }
    return posY + d.strength * this.annotationStrength * -1;
  }

  private getRectWidth(d: DataPoint) {
    if (d.display == Display.Circle) {
      return 0;
    }
    if (d.endTime == 0) {
      const w = Math.abs(this.currentTime - d.startTime) * this.getPositionXRatio();
      return w.toFixed(1);
    }
    return Math.abs(d.endTime - d.startTime) * this.getPositionXRatio();
  }

  public onResize() {
    const svgC = d3.select(`svg#${this.d3Container}${this.d3ContainerID}`);
    const svgL = d3.select(`svg#${this.d3Labels}${this.d3ContainerID}`);
    svgC.selectAll('rect').remove();
    svgC.selectAll('circle').remove();
    svgC.selectAll('line.marker').remove();
    svgL.selectAll('text').remove();
    this.drawTimeline();
    this.drawLines();
    let i = 0;
    this.annotationData?.forEach((_, row) => {
      this.drawAnnotations(row, i);
      i++;
    });
  }

  private getContainerWidth() {
    const container = document.getElementById(this.d3Container + this.d3ContainerID);
    if (container) {
      return container.getBoundingClientRect().width;
    }
    return 1000;
  }

  private getContainerHeight() {
    const container = document.getElementById(this.d3Container + this.d3ContainerID);
    if (container) {
      return container.getBoundingClientRect().height;
    }
    return this.markers.length * 60;
  }

  private setContainerHeight() {
    const container = document.getElementById(this.d3Container + this.d3ContainerID);
    if (container) {
      container.style.height = this.markers.length * 55 + 'px';
    }
  }

  public onMarkerAnnotationsDelete(marker: Marker) {
    this.deleteAnnotations.emit(marker);
  }
}
