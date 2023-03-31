import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { Session } from '../../types/session.entity';
import { environment } from '../../../../../environments/environment';
import { Clipboard } from '@angular/cdk/clipboard';
import { MessageService } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'koala-session-qrcode',
  templateUrl: './session-qrcode.component.html',
  styleUrls: [
    './session-qrcode.component.scss',
  ],
})
export class SessionQrcodeComponent implements OnChanges {
  @Input() session?: Session;
  @Input() visible = false;
  @Output() visibleChange = new EventEmitter<boolean>();

  baseUrl = environment.baseUrl;
  url = '';

  constructor(
    private readonly clipboard: Clipboard,
    private readonly messageService: MessageService,
    private readonly translate: TranslateService
  ) {}

  ngOnChanges(changes: SimpleChanges) {
    for (const propName in changes) {
      if (propName === 'session') {
        const change = changes[propName];

        this.buildUrl(change.currentValue.code);
      }
    }
  }

  onClose(event: any) {
    this.visibleChange.emit(!this.visible);
  }

  onCopy() {
    const success = this.clipboard.copy(this.url);

    if (success) {
      this.messageService.add({
        summary: this.translate.instant('SESSION.OVERVIEW.QRCODE.COPY_SUCCESS'),
        severity: 'success',
      });
    } else {
      this.messageService.add({
        summary: this.translate.instant('SESSION.OVERVIEW.QRCODE.COPY_ERROR'),
        severity: 'error',
      });
    }
  }

  private buildUrl(sessionCode: string) {
    this.url = this.baseUrl + '/auth?sessionCode=' + sessionCode;
  }
}
