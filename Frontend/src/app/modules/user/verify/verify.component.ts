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
  Email: string = ''; 
  remainingTime: number = 50; 
  timerInterval: any;
  otp: string = ''; 
  otpInvalid: boolean = true;
  verifyForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.Email = localStorage.getItem('userEmail') || ''; 
    this.verifyForm = this.fb.group({
      enteredOTP: ['', Validators.required] 
    });
    this.startTimer();
  }

  ngOnDestroy(): void {
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

      this.authService.verifyOTP(this.Email, +enteredOTP).subscribe(
        (response) => {
          console.log('OTP verification successful:', response);
          this.router.navigate(['/login']); 
        },
        (error) => {
          console.error('Error verifying OTP:', error);
          alert('OTP verification failed. Please try again.');
        }
      );
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

    this.remainingTime = 50;

    this.startTimer();
  }
}
