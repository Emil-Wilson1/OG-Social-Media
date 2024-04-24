import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
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

  onSubmit(): void {
    if (this.loginForm.invalid) {
      return;
    }

    const { email, password } = this.loginForm.value;

    this.userService.getUser({ email, password }).subscribe(
      (response) => {
        // Successful login, redirect to home page or dashboard
        if(response.passMatch){
          this.passMessage=response.passMatch
        }else if(response.emailMatch){
          this.emailMessage=response.emailMatch
        }else{
          this.router.navigate(['/home']);
        }
   
      },
      (error) => {
        console.error('Login failed:', error);
        this.errorMessage = 'Invalid username or password';
      }
    );
  }
}
