import { Component } from '@angular/core';

@Component({
  selector: 'koala-footer',
  templateUrl: './footer.component.html',
  styleUrls: [
    './footer.component.scss',
  ],
})
export class FooterComponent {
  constructor() {}

  public onHelpPressed() {
    window.open('https://koala-mhf.github.io/koala-app/', '_blank');
  }
}
