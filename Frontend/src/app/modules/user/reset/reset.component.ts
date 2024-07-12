import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-reset',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule,FormsModule],
  templateUrl: './reset.component.html',
  styleUrl: './reset.component.css'
})
export class ResetComponent {
  password: string = '';
  confirmPassword: string = '';
  token: string = '';
  private routeSub: Subscription = new Subscription();
  private resetPasswordSub: Subscription = new Subscription();

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private router:Router
  ) {}

  ngOnInit() {
    this.routeSub = this.route.queryParams.subscribe(params => {
      this.token = params['token'];
    });
  }

  onSubmit() {
    console.log(this.token);
    if (this.password && this.confirmPassword && this.password === this.confirmPassword) {
      this.resetPasswordSub = this.authService.resetPassword(this.token, this.password).subscribe({
        next: response => {
          console.log('Password reset successfully', response);
          this.toastr.success('Password reset successfully');
          this.router.navigate(['/login'])
        },
        error: error => {
          console.error('Error resetting password:', error);
          this.toastr.error('Failed to reset password');
        },
        complete: () => {
          console.log('Password reset request completed');
        }
      });
    } else {
      console.error('Passwords do not match or are missing');
      this.toastr.error('Passwords do not match or are missing');
    }
  }

  ngOnDestroy() {
    if (this.routeSub) {
      this.routeSub.unsubscribe();
    }
    if (this.resetPasswordSub) {
      this.resetPasswordSub.unsubscribe();
    }
  }
}