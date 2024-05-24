import { Store } from '@ngrx/store';
import { Component } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { FormsModule, NgForm, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Observable, Subscription, take } from 'rxjs';
import { IUser } from '../../../models/userModel';
import { fetchUserAPI } from '../../store/user/user.action';
import { SelectorData } from '../../store/user/user.selector';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-edit-profile',
  standalone: true,
  imports: [FormsModule,ReactiveFormsModule,CommonModule,RouterLink],
  templateUrl: './edit-profile.component.html',
  styleUrl: './edit-profile.component.css'
})
export class EditProfileComponent {
  userId: string= localStorage.getItem('userId') || '';
  selectedFile: File | null = null;
  user$!: Observable<IUser[]>;
  private subscriptions: Subscription = new Subscription();

  constructor(
    private authService: AuthService,
    private store: Store<{ user: IUser[] }>,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.store.dispatch(fetchUserAPI({ id: this.userId }));
    this.user$ = this.store.select(SelectorData);
    const userSubscription = this.user$.subscribe((data: any) => {
      console.log(data);
    });
    this.subscriptions.add(userSubscription);
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  onSubmit(profileForm: NgForm) { 
    const formData = new FormData();
    formData.append('fullname', profileForm.value.fullname);
    formData.append('username', profileForm.value.username);
    formData.append('gender', profileForm.value.gender);
    formData.append('bio', profileForm.value.bio);
    
    if (this.selectedFile) {
      console.log(this.selectedFile);
      formData.append('profilePic', this.selectedFile);
    }

    if (this.userId) {
      const editProfileSubscription = this.authService.editProfile(this.userId, formData)
        .subscribe({
          next: response => {
            this.router.navigateByUrl('/profile');
            console.log('Profile updated successfully', response);
          },
          error: error => {
            console.error('Failed to update profile', error);
          },
          complete: () => {
            console.log('Edit profile request completed');
          }
        });
      this.subscriptions.add(editProfileSubscription);
    } else {
      console.error('User ID is null');
    }
  }

  getImageUrl(file: File): string {
    return URL.createObjectURL(file);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
