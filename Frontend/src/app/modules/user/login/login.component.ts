import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
interface User{
  email:string;
  password:string;
}
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage!: string;
  passMessage!:string;
  emailMessage!:string;
  private subscription!: Subscription;
  
  constructor(
    private formBuilder: FormBuilder,
    private userService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });
  }


  ngOnInit() {
    if (this.userService.isLoggedIn) {
      this.router.navigateByUrl('/home');
    }
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      return;
    }

    const { email, password } = this.loginForm.value;

    this.subscription=this.userService.getUser({ email, password }).subscribe({
      next: (response) => {
        localStorage.setItem('userId', response.userId);
        localStorage.setItem('userToken', response.token);
        this.router.navigate(['/home']);
      },
      error: (error) => {
        console.error('Login failed:', error);
        if (error.status === 401) {
          if (error.error.message === 'Email not found') {
            this.emailMessage = 'Email not found';
          } else if (error.error.message === 'Incorrect password') {
            this.passMessage = 'Incorrect password';
          }
        } else {
          this.errorMessage = 'Login failed';
        }
      }
    });
  }


  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

}
