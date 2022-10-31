import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'koala-app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  constructor(private readonly router: Router) {}

  ngOnInit(): void {}

  public onToolbarSessionsPressed() {
    this.router.navigate(['sessions']);
  }

  public onToolbarHomePressed() {
    this.router.navigate(['']);
  }
}
