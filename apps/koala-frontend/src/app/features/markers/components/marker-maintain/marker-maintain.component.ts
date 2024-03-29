import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MarkerType } from '../../../../graphql/generated/graphql';
import { TranslateService } from '@ngx-translate/core';
import { MarkerService } from '../../services/marker.service';
import { ColorPicker } from 'primeng/colorpicker';

@Component({
  selector: 'koala-marker-maintain',
  templateUrl: './marker-maintain.component.html',
  styleUrls: [
    './marker-maintain.component.scss',
  ],
})
export class MarkerMaintainComponent {
  @Input() markerDataForm!: FormGroup;

  markerTypes = [
    {
      type: MarkerType.Event,
      name: this.translateService.instant('SESSION.MAINTAIN.MARKER.MARKER_EVENT_TYPE'),
    },
    {
      type: MarkerType.Range,
      name: this.translateService.instant('SESSION.MAINTAIN.MARKER.MARKER_RANGE_TYPE'),
    },
    {
      type: MarkerType.Slider,
      name: this.translateService.instant('SESSION.MAINTAIN.MARKER.MARKER_SLIDER_TYPE'),
    },
  ];

  icons = this.markersService.getAllIcons();
  selectedIcon = 0;
  selectedMarkerType = 0;
  color = '';
  abbreviation = '';

  MarkerType = MarkerType;

  get markerType() {
    return this.markerDataForm.get('type')?.value;
  }

  public onColorChanged(color: ColorPicker): void {
    // update form value manually
    color.writeValue(color.inputBgColor);
    color.onModelChange(color.inputBgColor);
  }

  constructor(private readonly markersService: MarkerService, private readonly translateService: TranslateService) {}
}
