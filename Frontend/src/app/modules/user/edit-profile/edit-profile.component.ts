import { Store } from '@ngrx/store';
import { Component } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { FormsModule, NgForm, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { IUser } from '../../models/userModel';
import { fetchUserAPI } from '../../store/user.action';
import { SelectorData } from '../../store/user.selector';
import { Router } from '@angular/router';

@Component({
  selector: 'app-edit-profile',
  standalone: true,
  imports: [FormsModule,ReactiveFormsModule,CommonModule],
  templateUrl: './edit-profile.component.html',
  styleUrl: './edit-profile.component.css'
})
export class EditProfileComponent {
  user:string | null=localStorage.getItem('userId')
  selectedFile: File | null = null;
  user$!: Observable<IUser[]>; // Define the observable with User type
  constructor(private authService: AuthService,private store:Store<{ user: IUser[] }>,private router:Router) {}

  ngOnInit(): void {
    this.store.dispatch(fetchUserAPI());
    this.user$ = this.store.select(SelectorData);
    this.user$.subscribe((data: any) => {
      console.log(data)
    });
  }


onFileSelected(event: any) {
  this.selectedFile = event.target.files[0];
}

  onSubmit(profileForm: NgForm) { // Change the parameter type to NgForm
    const formData = new FormData();

    // Append form data
    formData.append('fullname', profileForm.value.fullname);
    formData.append('username', profileForm.value.username);
    formData.append('gender', profileForm.value.gender);
    formData.append('bio', profileForm.value.bio);

    
    if (this.selectedFile) {
      console.log(this.selectedFile);
      formData.append('profilePic', this.selectedFile);
    }

    if (this.user) {
      this.authService.editProfile(this.user, formData)
        .subscribe(
          response => {
            console.log('Profile updated successfully', response);
            this.router.navigate(['/login']);
          },
          error => {
            console.error('Failed to update profile', error);
            // Handle error message
          }
        );
    } else {
      console.error('User ID is null');
      // Handle null user ID error
    }
  }

  getImageUrl(file: File): string {
    return URL.createObjectURL(file);
  }
}
