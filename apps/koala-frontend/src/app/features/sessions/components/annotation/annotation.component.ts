import {
  Component,
  Input,
  AfterViewInit,
  OnChanges,
  OnDestroy,
  SimpleChanges,
  Output,
  EventEmitter,
  ViewChild,
} from '@angular/core';
import { Marker } from '../../types/marker.entity';
import { Comment } from '../../types/comment.entity';
import { MarkerService } from '../../../markers/services/marker.service';
import { ConfirmationService } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';
import * as d3 from 'd3';
import { AnnotationAudioComment } from '../annotation-audio-comment/annotation-audio-comment.component';
import { AnnotationDetailComponent } from '../annotation-detail/annotation-detail.component';
import { CreateAnnotationTextComment } from '../annotation-text-comment-list/annotation-text-comment-list.component';
import { OverlayPanel } from 'primeng/overlaypanel';
import { AnnotationService } from '../../services/annotation.service';
import { Subscription } from 'rxjs';

export enum Display {
  Rect = 'rect',
  Circle = 'circle',
}

export interface DataPoint {
  id: number;
  note?: string;
  mediaId?: number;
  strength?: number;
  display: Display;
  startTime: number;
  endTime: number;
  color: string;
  transparent?: boolean;
  active?: boolean;
  comments?: Comment[];
}

@Component({
  selector: 'koala-app-annotation',
  templateUrl: './annotation.component.html',
  styleUrls: [
    './annotation.component.scss',
    '../../session-common.scss',
  ],
})
export class AnnotationComponent implements AfterViewInit, OnChanges, OnDestroy {
  @Input() annotationData?: Map<number, Array<DataPoint>> = new Map<number, Array<DataPoint>>();
  @Input() totalTime = 1;
  @Input() currentTime = 0;
  @Input() markers: Marker[] = [];
  @Input() d3ContainerID = 0;
  @Input() displayMode = false;
  @Input() enableAnnotationDelete = false;
  @Input() deactivateAnnotationDelete = false;
  @Input() disableComments = false;

  @Output() deleteAnnotations = new EventEmitter<Marker>();
  @Output() annotationTextCommentCreate = new EventEmitter<CreateAnnotationTextComment>();
  @Output() annotationTextCommentUpdate = new EventEmitter<Comment>();
  @Output() annotationTextCommentRemove = new EventEmitter<number>();
  @Output() annotationAudioComment = new EventEmitter<AnnotationAudioComment>();
  @Output() annotationAudioCommentDelete = new EventEmitter<number>();
  @Output() annotationSelected = new EventEmitter<number>();

  @ViewChild('annotationDetail') annotationDetail!: AnnotationDetailComponent;

  private sliderHeight = 2.5;
  d3Container = 'd3-container-';
  d3Labels = 'd3-labels-';
  d3tooltip: any;

  @ViewChild('annotationDetailOverlay') annotationDetailOverlay?: OverlayPanel;
  annotationDetailOverlayStyle = { top: '0px', left: '0px' };
  selectedDataPoint: DataPoint | null = null;
  private annotationSelectedSubscription: Subscription | undefined;

  constructor(
    private readonly markerService: MarkerService,
    private confirmationService: ConfirmationService,
    private readonly translateService: TranslateService,
    private readonly annotationService: AnnotationService
  ) {
    this.annotationSelectedSubscription = this.annotationService.annotationSelected$.subscribe(() => {
      this.annotationDetailOverlay?.hide();
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes) {
      if (changes['markers']) {
        if (this.markers.length == 0) {
          return;
        }
        this.setContainerHeight();
        this.drawTimeline();
        this.drawLines();
        this.drawAnnotationsForAllRows();
      }
      if (changes['currentTime'] || changes['annotationData']) {
        this.drawTimeline();
        this.drawAnnotationsForAllRows();
        this.annotationData?.forEach((data) => {
          data.forEach((annotation) => {
            if (this.selectedDataPoint && annotation.id === this.selectedDataPoint.id) {
              this.selectedDataPoint = annotation;
            }
          });
        });
      }
    }
  }

  ngAfterViewInit() {
    this.drawTimeline();
  }

  ngOnDestroy(): void {
    const svgC = d3.select(`svg#${this.d3Container}${this.d3ContainerID}`);
    const svgL = d3.select(`svg#${this.d3Labels}${this.d3ContainerID}`);
    svgC.selectAll('rect').remove();
    svgC.selectAll('circle').remove();
    svgC.selectAll('line.marker').remove();
    svgL.selectAll('text').remove();

    this.annotationSelectedSubscription?.unsubscribe();
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
    const notificationRow = svgC.selectAll('g').data(this.markers);
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
    notificationRow.style('visibility', (m: Marker) => (m.visible ? 'visible' : 'hidden'));
    notificationRow
      .enter()
      .append('g')
      .attr('id', (m: Marker) => `row_${m.id}_notifications`);
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

  private drawAnnotationsForAllRows() {
    let i = 0;
    this.annotationData?.forEach((_, row) => {
      this.drawAnnotations(row, i, this.markers[i]);

      if (!this.disableComments) {
        this.drawNotifications(row, i, this.markers[i]);
      }
      i++;
    });
  }

  private drawAnnotations(row: number, index: number, m: Marker) {
    const svg = d3.select(`svg#${this.d3Container}${this.d3ContainerID}`);
    const trans = svg.transition().duration(50);
    const posY = this.getPositionY(index);
    const rowElem = svg.select('g#row_' + row);

    const mouseover = (d: DataPoint, ev: any) => {
      if (!d.transparent) {
        d3.select(ev.target).style('stroke', 'black').style('opacity', 1);
      }
    };
    const click = (d: DataPoint, ev: any) => {
      this.selectedDataPoint = d;
      this.annotationSelected.emit(d.id);

      if (!this.disableComments) {
        this.annotationDetailOverlay?.show(null, ev.target);
        this.annotationDetailOverlayStyle.top = ev.target.getBoundingClientRect().y + window.scrollY + 10 + 'px';
        this.annotationDetailOverlayStyle.left = ev.target.getBoundingClientRect().x + window.scrollX + 'px';
      }
    };
    const mouseleave = (d: DataPoint, ev: any) => {
      if (!d.transparent) {
        d3.select(ev.target).style('stroke', 'none').style('opacity', 1);
      }
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
            .attr('x', (d: DataPoint) => this.getPositionXRatio() * (d.startTime / 1000))
            .attr('y', (d: DataPoint) => this.getRectPositionY(d, posY, m))
            .attr('cx', (d: DataPoint) => this.getPositionXRatio() * (d.startTime / 1000))
            .attr('cy', posY)
            .attr('r', 5)
            .attr('visibility', m.visible ? 'visible' : 'hidden')
            .attr('width', (d: DataPoint) => this.getRectWidth(d))
            .attr('height', (d: DataPoint) => this.getRectHeight(d, m))
            .attr('id', (d: DataPoint) => `row_${row}_${d.id}`)
            .attr('fill', (d: DataPoint) => d.color)
            .attr('opacity', (d: DataPoint) => (d.transparent ? 0.3 : 1))
            .on('mouseleave', (ev, d) => mouseleave(d, ev))
            .on('mouseover', (ev, d) => mouseover(d, ev))
            .on('click', (ev, d) => click(d, ev)),
        (update) =>
          update.call((update) =>
            update
              .transition(trans)
              .attr('x', (d: DataPoint) => this.getPositionXRatio() * (d.startTime / 1000))
              .attr('y', (d: DataPoint) => this.getRectPositionY(d, posY, m))
              .attr('cx', (d: DataPoint) => this.getPositionXRatio() * (d.startTime / 1000))
              .attr('height', (d: DataPoint) => this.getRectHeight(d, m))
              .attr('cy', posY)
              .attr('width', (d: DataPoint) => this.getRectWidth(d))
              .attr('visibility', m.visible ? 'visible' : 'hidden')
              .attr('opacity', (d: DataPoint) => (d.transparent ? 0.3 : 1))
          ),
        (exit) => exit.call((update) => update.transition(trans).attr('width', 0).attr('height', 0).remove())
      );
    rowElem.raise();
  }

  private drawNotifications(row: number, index: number, m: Marker) {
    const svg = d3.select(`svg#${this.d3Container}${this.d3ContainerID}`);
    const posY = this.getPositionY(index);
    const rowElem = svg.select(`g#row_${row}_notifications`);
    const getIcon = function (d: DataPoint) {
      if (d.comments && d.comments!.length > 0) {
        return 'pi pi-comment';
      }
      if (d.mediaId) {
        return 'pi pi-volume-up';
      }
      return '';
    };
    const getXPosition = (d: DataPoint) => {
      if (d.display == Display.Circle) {
        return this.getPositionXRatio() * (d.startTime / 1000) - 2;
      }
      return this.getPositionXRatio() * (d.startTime / 1000) + this.getRectWidth(d) / 2;
    };
    const getYPosition = (d: DataPoint) => {
      if (d.display == Display.Circle) {
        return this.getRectPositionY(d, posY, m) - 15;
      }
      return this.getRectPositionY(d, posY, m) - 12;
    };
    rowElem
      .selectAll<SVGRectElement, DataPoint>('*')
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      .data<DataPoint>(this.annotationData!.get(row)!)
      .join(
        (enter) =>
          enter
            .append('svg:foreignObject')
            .attr('font-family', 'primeicons')
            .attr('class', (d: DataPoint) => getIcon(d))
            .attr('width', '12px')
            .attr('height', '12px')
            .style('font-size', '12px')
            .style('color', (d: DataPoint) => d.color)
            .attr('visibility', m.visible ? 'visible' : 'hidden')
            .attr('y', (d: DataPoint) => getYPosition(d))
            .attr('x', (d: DataPoint) => getXPosition(d))
            .attr('id', (d: DataPoint) => `row_${row}_notification_${d.id}`),
        (update) =>
          update.call((update) =>
            update
              .attr('visibility', m.visible ? 'visible' : 'hidden')
              .attr('y', (d: DataPoint) => getYPosition(d))
              .attr('x', (d: DataPoint) => getXPosition(d))
              .attr('class', (d: DataPoint) => getIcon(d))
          ),
        (exit) => exit.call((update) => update.attr('width', 0).attr('height', 0).remove())
      );
  }

  private drawTimeline() {
    const line = d3.select(`svg#${this.d3Container}${this.d3ContainerID}`).selectAll('line#timeline').data<number>([
      this.currentTime,
    ]);

    let time = 1;
    if (this.getPositionXRatio() !== Infinity) {
      time = this.currentTime * this.getPositionXRatio() < 1 ? 2 : this.currentTime * this.getPositionXRatio();
    }

    if (this.currentTime >= this.totalTime) {
      time = this.getContainerWidth() - 1;
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

  private getRectHeight(d: DataPoint, m: Marker) {
    if (!d.strength || d.strength == 0) {
      return 4;
    }
    if (m.valueRangeTo) {
      this.sliderHeight = 25 / m.valueRangeTo;
    }
    return Math.abs(d.strength) * this.sliderHeight;
  }

  private getRectPositionY(d: DataPoint, posY: number, m: Marker) {
    if (!d.strength) {
      return posY - 2;
    }
    if (d.strength < 0) {
      return posY;
    }
    if (m.valueRangeTo) {
      this.sliderHeight = 25 / m.valueRangeTo;
    }
    return posY + d.strength * this.sliderHeight * -1;
  }

  private getRectWidth(d: DataPoint): number {
    if (d.display == Display.Circle) {
      return 0;
    }
    if (d.active) {
      const w = Math.abs(this.currentTime - d.startTime / 1000) * this.getPositionXRatio();
      return +w.toFixed(1);
    }
    return Math.abs(d.endTime / 1000 - d.startTime / 1000) * this.getPositionXRatio();
  }

  public onResize() {
    const svgC = d3.select(`svg#${this.d3Container}${this.d3ContainerID}`);
    const svgL = d3.select(`svg#${this.d3Labels}${this.d3ContainerID}`);
    svgC.selectAll('rect').remove();
    svgC.selectAll('circle').remove();
    svgC.selectAll('line.marker').remove();
    svgC.selectAll('foreignobject').remove();
    svgL.selectAll('text').remove();
    this.drawTimeline();
    this.drawLines();
    this.drawAnnotationsForAllRows();
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
    return this.markers.length * 65;
  }

  private setContainerHeight() {
    const container = document.getElementById(this.d3Container + this.d3ContainerID);
    if (container) {
      container.style.height = this.markers.length * 65 + 'px';
    }
  }

  public onMarkerAnnotationsDelete(marker: Marker) {
    this.confirmationService.confirm({
      message: this.translateService.instant('SESSION.ANNOTATION.DELETE.CONFIRM_MESSAGE_TITLE', {
        markerName: marker.name,
      }),
      header: this.translateService.instant('SESSION.ANNOTATION.DELETE.HEADER'),
      icon: 'pi pi-exclamation-triangle',
      rejectLabel: this.translateService.instant('SESSION.ANNOTATION.DELETE.REJECT_LABEL'),
      acceptLabel: this.translateService.instant('SESSION.ANNOTATION.DELETE.ACCEPT_LABEL'),
      accept: () => {
        this.deleteAnnotations.emit(marker);
      },
    });
  }

  onAnnotationTextCommentCreate(annotationTextComment: CreateAnnotationTextComment) {
    this.annotationTextCommentCreate.emit(annotationTextComment);
  }

  onAnnotationTextCommentUpdate(annotationTextComment: Comment) {
    this.annotationTextCommentUpdate.emit(annotationTextComment);
  }

  onAnnotationTextCommentRemove(commentId: number) {
    this.annotationTextCommentRemove.emit(commentId);
  }

  onAnnotationAudioCommentSave(annotationDetail: AnnotationAudioComment) {
    this.annotationAudioComment.emit(annotationDetail);
  }

  onAnnotationAudioCommentDelete(annotationId: number) {
    this.annotationAudioCommentDelete.emit(annotationId);
  }

  onAnnotationDetailClosed() {
    this.annotationDetail.resetComment();
  }
}
