import { CommonModule } from '@angular/common';
import { AuthService } from './../../../services/auth.service';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import {  Router } from '@angular/router';
import * as CryptoJS from 'crypto-js';

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

  inCorrect: boolean = false;
   constructor(private fb:FormBuilder,private auth:AuthService,private route:Router){}

   registerForm=this.fb.group({
    fullname:['',[Validators.required]],
    email:['',[Validators.email,Validators.required]],
    username:['',[Validators.required]],
    password:['',
    [
      Validators.required,
      Validators.pattern( '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*_=+-]).{8,}$')
    ]],
    cpassword:['',[Validators.required]]
   });

   onSubmit(){
    this.submit = true;
    const {fullname,email,username,password,cpassword}=this.registerForm.value
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
    this.auth.createUser(user).subscribe({
      next: (response) => {
        localStorage.setItem('userEmail',response.email)
        alert('Registration Completed!');
        this.route.navigate(['/verify']);
      },
      error: (error: any) => {
        console.log('Error registering user:', error);
        if (error.status === 400 && error.error.message === 'Email address is already in use') {
          alert('Email address is already in use. Please use a different email.');
        } else {
          alert('Registration failed. Please try again.');
        }
      }
    });
  }
}

}
