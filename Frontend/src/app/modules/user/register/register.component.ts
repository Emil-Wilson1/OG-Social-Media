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
  registerForm!: FormGroup;
  submit: boolean = false;
  errorMessage: string = '';
  private registerSub?: Subscription;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private route: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      fullname: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [
        Validators.required,
        Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*_=+-]).{8,}$')
      ]],
      cpassword: ['', [Validators.required]]
    }, { validator: this.passwordMatchValidator });
  }

  ngOnDestroy(): void {
    this.registerSub?.unsubscribe();
  }

  passwordMatchValidator(form: FormGroup) {
    return form.controls['password'].value === form.controls['cpassword'].value ? null : { mismatch: true };
  }

  onSubmit(): void {
    this.submit = true;
    if (this.registerForm.valid) {
      this.registerUser();
    } else {
      this.errorMessage = 'Please correct the errors in the form.';
    }
  }

  registerUser(): void {
    const formValue = this.registerForm.value;
    const user = {
      fullname: formValue.fullname,
      email: formValue.email,
      username: formValue.username,
      password: formValue.password,
    };

    this.registerSub = this.auth.signup(user).subscribe({
      next: (response) => {
        localStorage.setItem('userEmail', response.email);
        this.toastr.success('Registration Completed!');
        this.route.navigate(['/verify']);
        this.errorMessage = '';
      },
      error: (error) => {
        this.errorMessage = error.error.error;
        this.toastr.error(this.errorMessage);
        console.log('Error registering user:', error);
      }
    });
  }

  get formControls() {
    return this.registerForm.controls;
  }
}

