import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule,FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class adminLoginComponent {
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
      email: ['', [Validators.required,Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6),Validators.pattern("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*_=+-]).{8,}$")]]
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      return;
    }

    const { email, password } = this.loginForm.value;

    this.userService.getadmin({ email, password }).subscribe(
      (response) => {
        localStorage.setItem('userId',response.userId)
        if(response.passMatch){
          this.passMessage=response.passMatch
        }else if(response.emailMatch){
          this.emailMessage=response.emailMatch
        }else{
         
          this.router.navigate(['/users']);
        }
   
      },
      (error) => {
        console.error('Login failed:', error);
        this.errorMessage = 'Invalid username or password';
      }
    );
  }
}


