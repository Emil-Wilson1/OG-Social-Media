import { CommonModule } from '@angular/common';
import { Component, Pipe } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { EmailMaskPipe } from '../../../pipes/emailMask';
import { AuthService } from '../../../services/auth.service';
import { FormsModule, Validators, FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
interface verifyRes{
  message:string
}

@Component({
  selector: 'app-verify',
  standalone: true,
  imports: [EmailMaskPipe,CommonModule,FormsModule,ReactiveFormsModule],
  templateUrl: './verify.component.html',
  styleUrl: './verify.component.css'
})
export class VerifyComponent {
  Email: string = '';
  remainingTime: number = 50;
  timerInterval: any;
  otp: string = '';
  otpInvalid: boolean = true;
  verifyForm!: FormGroup;
  message: string = '';
  private subscriptions: Subscription[] = [];

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) {
    this.verifyForm = this.fb.group({
      enteredOTP: ['', Validators.required]
    });
    this.startTimer();
    this.Email = localStorage.getItem('userEmail') || '';
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
    clearInterval(this.timerInterval);
  }

  onOtpChange(): void {
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
  
      console.log(this.Email);
  
      const verifySub = this.authService.verifyOTP(this.Email, +enteredOTP).subscribe({
        next: (response) => {
          console.log('OTP verification successful:', response);
          localStorage.removeItem('userEmail');
          this.router.navigate(['/login']);
        },
        error: (error) => {
          console.error('Error verifying OTP:', error);
          this.toastr.error('OTP verification failed. Please try again.')
        }
      });
  
      this.subscriptions.push(verifySub);
    }
  }

  startTimer(): void {
    this.timerInterval = setInterval(() => {
      if (this.remainingTime > 0) {
        this.remainingTime--;
      } else {
        clearInterval(this.timerInterval);
      }
    }, 1000);
  }

  resendCode(): void {
    if (!this.Email) {
      this.message = 'Email is required';
      return;
    }

    this.remainingTime = 50;
    console.log("worked");
    this.startTimer();

    const resendSub = this.authService.resendOtp(this.Email).subscribe({
      next: (response: verifyRes) => {
        console.log("Response:", response);
        this.message = 'OTP sent successfully';
      },
      error: (error: any) => {
        this.message = 'Failed to send OTP';
        console.error('Error:', error);
      },
      complete: () => {
        console.log('OTP resend request completed');
      }
    });

    this.subscriptions.push(resendSub);
  }
}

