import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-rest',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './rest.component.html',
  styleUrl: './rest.component.css'
})
export class RestComponent {
  forgotPasswordForm!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private forgotPasswordService: AuthService
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
    this.forgotPasswordService.forgotPassword(email).subscribe(
      response => {
        console.log('Reset password link sent successfully!', response);
        // Handle success message or navigation
      },
      error => {
        console.error('Error resetting password:', error);
        // Handle error message or display error to the user
      }
    );
  }
}
