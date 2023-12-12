import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MarkersRoutingModule } from './markers-routing.module';
import { MarkersOverviewPage } from './pages/markers-overview/markers-overview.page';
import { MarkerOverviewListComponent } from './components/marker-overview-list/marker-overview-list.component';
import { SharedModule } from '../../shared/shared.module';
import { MarkerButtonComponent } from './components/marker-button/marker-button.component';
import { MarkerIconComponent } from './components/marker-icon/marker-icon.component';
import { SliderModule } from 'primeng/slider';
import { TableModule } from 'primeng/table';
import { MarkerPreviewComponent } from './components/marker-preview/marker-preview.component';
import { MarkerService } from './services/marker.service';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { ToolbarModule } from 'primeng/toolbar';
import { DialogModule } from 'primeng/dialog';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { InputNumberModule } from 'primeng/inputnumber';
import { ColorPickerModule } from 'primeng/colorpicker';
import { InputSwitchModule } from 'primeng/inputswitch';
import { MarkerMaintainComponent } from './components/marker-maintain/marker-maintain.component';
import { RippleModule } from 'primeng/ripple';

@NgModule({
  declarations: [
    MarkersOverviewPage,
    MarkerOverviewListComponent,
    MarkerButtonComponent,
    MarkerIconComponent,
    MarkerPreviewComponent,
    MarkerMaintainComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    MarkersRoutingModule,
    SliderModule,
    TableModule,
    InputTextModule,
    DropdownModule,
    ToolbarModule,
    DialogModule,
    CheckboxModule,
    InputTextareaModule,
    InputNumberModule,
    ColorPickerModule,
    InputSwitchModule,
    RippleModule,
  ],
  exports: [
    MarkerOverviewListComponent,
    MarkerButtonComponent,
    MarkerIconComponent,
    MarkerPreviewComponent,
    MarkerMaintainComponent,
  ],
})
export class MarkersModule {}
