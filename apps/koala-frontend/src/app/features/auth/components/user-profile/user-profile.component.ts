import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'koala-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: [
    './user-profile.component.scss',
  ],
})
export class UserProfileComponent implements OnInit, OnChanges {
  @Input() visible = false;
  @Output() visibleChange = new EventEmitter<boolean>();
  maintainUserProfileForm: FormGroup;

  constructor(private readonly authService: AuthService) {
    this.maintainUserProfileForm = new FormGroup({
      displayName: new FormControl<string>('', Validators.required),
    });
  }

  ngOnInit(): void {
    this.readUserData();
  }

  ngOnChanges(changes: SimpleChanges) {
    for (const propName in changes) {
      if (propName === 'visible') {
        const change = changes[propName];

        if (change?.currentValue === true) {
          this.readUserData();
        }
      }
    }
  }

  onSave() {
    this.authService.updateUser(this.maintainUserProfileForm.get('displayName')?.value).subscribe((result) => {
      console.log(result);
    });

    this.maintainUserProfileForm.reset();

    this.visibleChange.emit(false);
  }

  onClose() {
    this.visibleChange.emit(false);
  }

  private readUserData() {
    this.authService.me().subscribe((result) => {
      this.maintainUserProfileForm.get('displayName')?.setValue(result.displayName || '');
    });
  }
}
