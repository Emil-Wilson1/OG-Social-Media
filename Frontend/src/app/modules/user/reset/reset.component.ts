import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-reset',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule,FormsModule],
  templateUrl: './reset.component.html',
  styleUrl: './reset.component.css'
})
export class ResetComponent {


  password: string = '';
  confirmPassword: string = '';
  token: string = '';

  constructor(private authService: AuthService,private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.token = params['token'];
    });
  }
  onSubmit() {
    console.log(this.token);
    
    this.authService.resetPassword(this.token, this.password)
      .subscribe(
        response => {
          console.log('Password reset successfully');
          
        },
        error => {
          console.error('Error resetting password:', error);
        
        }
      );
  }
}
