import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-rest',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule,RouterLink],
  templateUrl: './rest.component.html',
  styleUrl: './rest.component.css'
})
export class RestComponent {
  forgotPasswordForm!: FormGroup;
  private subscription: Subscription = new Subscription();

  constructor(
    private formBuilder: FormBuilder,
    private forgotPasswordService: AuthService,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.forgotPasswordForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit() {
    if (this.forgotPasswordForm.invalid) {
      return;
    }

    const email = this.forgotPasswordForm.value.email;
    const sub = this.forgotPasswordService.forgotPassword(email).subscribe({
      next: response => {
        this.toastr.success('Reset password link sent successfully!');
        console.log('Reset password link sent successfully!', response);
      },
      error: error => {
        this.toastr.error('Error resetting password.');
        console.error('Error resetting password:', error);
      }
    });

    this.subscription.add(sub);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
