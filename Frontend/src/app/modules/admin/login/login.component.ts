import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
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
      email: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      return;
    }

    const { email, password } = this.loginForm.value;

    this.userService.getadmin({ email, password }).subscribe(
      (response) => {
        // Successful login, redirect to home page or dashboard
        localStorage.setItem('userId',response.userId)
        if(response.passMatch){
          this.passMessage=response.passMatch
        }else if(response.emailMatch){
          this.emailMessage=response.emailMatch
        }else{
         
          this.router.navigate(['/profile']);
        }
   
      },
      (error) => {
        console.error('Login failed:', error);
        this.errorMessage = 'Invalid username or password';
      }
    );
  }
}


