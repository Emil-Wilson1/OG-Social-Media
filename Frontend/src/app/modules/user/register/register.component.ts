import { CommonModule } from '@angular/common';
import { AuthService } from './../../../services/auth.service';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import {  Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';

interface User {
  email: string;
  username: string;
  fullname: string;
  password: string;
}
@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  submit: boolean = false;
  errorMessage!: string;
  inCorrect: boolean = false;
  private registerSub?: Subscription;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private route: Router,
    private toastr: ToastrService
  ) {}

  registerForm = this.fb.group({
    fullname: ['', [Validators.required]],
    email: ['', [Validators.email, Validators.required]],
    username: ['', [Validators.required]],
    password: ['', [
      Validators.required,
      Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*_=+-]).{8,}$')
    ]],
    cpassword: ['', [Validators.required]]
  });

  ngOnDestroy(): void {
    this.registerSub?.unsubscribe();
  }

  onSubmit(): void {
    this.submit = true;
    const { fullname, email, username, password, cpassword } = this.registerForm.value;
    if (cpassword === password) {
      if (fullname && email && password && username) {
        this.registerUser();
      }
    }
  }

  registerUser(): void {
    if (this.registerForm.valid) {
      const formValue = this.registerForm.value;

      const fullname: string = formValue.fullname ?? ''; 
      const email: string = formValue.email ?? ''; 
      const username: string = formValue.username ?? ''; 
      const password: string = formValue.password ?? ''; 

      const user: User = {
        fullname,
        email,
        username,
        password,
      };

      this.registerSub = this.auth.signup(user).subscribe({
        next: (response) => {
          localStorage.setItem('userEmail', response.email);
          this.toastr.success('Registration Completed!');
          this.route.navigate(['/verify']);
          this.errorMessage = "";
        },
        error: (error: any) => {
          this.errorMessage = error.error.error;
          this.toastr.error(this.errorMessage);
          console.log('Error registering user:', error);
        }
      });
    }
  }
}

