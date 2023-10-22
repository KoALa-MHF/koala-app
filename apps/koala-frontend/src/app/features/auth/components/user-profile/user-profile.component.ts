import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Role, User } from '../../../../graphql/generated/graphql';
import { Subscription } from 'rxjs';

@Component({
  selector: 'koala-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: [
    './user-profile.component.scss',
  ],
})
export class UserProfileComponent implements OnInit, OnChanges, OnDestroy {
  @Input() visible = false;
  @Output() visibleChange = new EventEmitter<boolean>();
  maintainUserProfileForm: FormGroup;

  user?: User;
  Role = Role;
  isAuthSubscription: Subscription | undefined;
  isAuthenticated$ = this.authService.isAuthenticated$;

  constructor(private readonly authService: AuthService) {
    this.maintainUserProfileForm = new FormGroup({
      displayName: new FormControl<string>('', Validators.required),
    });
  }

  ngOnInit(): void {
    this.isAuthSubscription = this.isAuthenticated$.subscribe((authenticated) => {
      if (authenticated) {
        this.readUserData();
      }
    });
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

  ngOnDestroy(): void {
    this.isAuthSubscription?.unsubscribe();
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
      this.user = result;
      this.maintainUserProfileForm.get('displayName')?.setValue(result.displayName || '');
    });
  }
}
