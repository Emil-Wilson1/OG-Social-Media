import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { IUser } from '../../models/userModel';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { fetchUserAPI } from '../../store/admin/admin.action';
import { userSelectorData } from '../../store/admin/admin.selector';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-management.component.html',
  styleUrl: './user-management.component.css'
})
export class UserManagementComponent {
  users$!: Observable<IUser[]>;
  constructor(private store: Store<{ allUser: IUser[] }>, private userServices: AuthService, private router : Router) { }

  ngOnInit(): void {
    this.store.dispatch(fetchUserAPI())
    this.users$ = this.store.select(userSelectorData)
    console.log(this.users$);
  }
  userId!: string;


  blockUser(userId: string): void {
    console.log("helllo");
    
    if (!userId) {
      console.error('User ID is required');
      return;
    }
console.log(userId);

    this.userServices.blockUser(userId).subscribe(
      response => {
        console.log('User blocked successfully:', response);
        // Handle success message or redirect as needed
        this.store.dispatch(fetchUserAPI())
      },
      error => {
        console.error('Error blocking user:', error);
        // Handle error message as needed
      }
    );
  }


  unblockUser(userId: string): void {
    console.log("helllo");
    
    if (!userId) {
      console.error('User ID is required');
      return;
    }
console.log(userId);

    this.userServices.unblockUser(userId).subscribe(
      response => {
        console.log('User unblocked successfully:', response);
        // Handle success message or redirect as needed
        this.store.dispatch(fetchUserAPI())
      },
      error => {
        console.error('Error unblocking user:', error);
        // Handle error message as needed
      }
    );
  }

  
}
