import { CommonModule } from '@angular/common';
import { Component, Pipe } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { EmailMaskPipe } from '../pipes/emailMask';
import { AuthService } from '../../../services/auth.service';
import { FormsModule, Validators, FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-verify',
  standalone: true,
  imports: [EmailMaskPipe,CommonModule,FormsModule,ReactiveFormsModule],
  templateUrl: './verify.component.html',
  styleUrl: './verify.component.css'
})
export class VerifyComponent {
  Email: string = ''; // Define Email property
  remainingTime: number = 50; // Initial remaining time in seconds
  timerInterval: any; // Variable to hold the interval reference
  otp: string = ''; // Variable to hold the entered OTP
  otpInvalid: boolean = true;
  verifyForm!: FormGroup; // Form group for OTP verification

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.Email = localStorage.getItem('userEmail') || ''; // Retrieve and assign email from localStorage
    this.verifyForm = this.fb.group({
      enteredOTP: ['', Validators.required] // Define form control with validation
    });
    this.startTimer();
  }

  ngOnDestroy(): void {
    clearInterval(this.timerInterval);
  }

  onOtpChange(): void {
    // Check if OTP is entered
    this.otpInvalid = this.otp.length !== 4;
  }

  verifyOTP(): void {
    if (this.verifyForm.valid) {
      const enteredOTP: string = this.otp;
      console.log('Entered OTP:', enteredOTP);

      if (!this.Email) {
        console.error('User email not found in localStorage.');
        return;
      }

      this.authService.verifyOTP(this.Email, +enteredOTP).subscribe(
        (response) => {
          console.log('OTP verification successful:', response);
          this.router.navigate(['/login']); // Redirect to dashboard on OTP verification success
        },
        (error) => {
          console.error('Error verifying OTP:', error);
          alert('OTP verification failed. Please try again.');
        }
      );
    }
  }

  startTimer(): void {
    // Set up a timer that runs every second
    this.timerInterval = setInterval(() => {
      if (this.remainingTime > 0) {
        this.remainingTime--; // Decrease the remaining time by 1 second
      } else {
        clearInterval(this.timerInterval); // Clear the interval when time reaches zero
        // Optionally handle what to do when timer completes (e.g., show a message)
      }
    }, 1000); // Interval of 1000 ms (1 second)
  }

  resendCode(): void {
    // Reset remainingTime to 90 seconds (or any desired duration)
    this.remainingTime = 50;
    // Restart the timer
    this.startTimer();
  }
}
