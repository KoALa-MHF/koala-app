import { CanDeactivate } from '@angular/router';
import { Observable } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { Injectable } from '@angular/core';

export interface BlockNavigationIfUnsavedChanges {
  hasUnsavedChanges(): boolean;
  endActiveSliders(time?: number): void;
}

@Injectable({ providedIn: 'root' })
export class UnsavedChangesGuard<T extends BlockNavigationIfUnsavedChanges> implements CanDeactivate<T> {
  constructor(private readonly translateService: TranslateService) {}
  canDeactivate(component: T): Observable<boolean> | boolean {
    if (!component.hasUnsavedChanges()) {
      return true;
    } else {
      component.endActiveSliders();
      return true;
    }
  }
}
