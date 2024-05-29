import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { IUser } from '../../../models/userModel';
import { Observable, Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { fetchUsersAPI } from '../../../modules/store/admin/admin.action';
import { userSelectorData } from '../../../modules/store/admin/admin.selector';
import { AdminService } from '../../services/admin.service';
import { NgxPaginationModule, PaginatePipe } from 'ngx-pagination';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [CommonModule,NgxPaginationModule],
  templateUrl: './user-management.component.html',
  styleUrl: './user-management.component.css',
})
export class UserManagementComponent {
  users$!: Observable<IUser[]>;
  private blockUserSubscription!: Subscription;
  private unblockUserSubscription!: Subscription;
  userId!: string;
  page: number = 1;
  constructor(
    private store: Store<{ allUser: IUser[] }>,
    private adminService:AdminService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.store.dispatch(fetchUsersAPI());
    this.users$ = this.store.select(userSelectorData);
    console.log(this.users$);
  }
  
    blockUser(userId: string): void {
      console.log('helllo');
      if (!userId) {
        console.error('User ID is required');
        return;
      }
      console.log(userId);
      this.blockUserSubscription = this.adminService.blockUser(userId).subscribe({
        next: (response) => {
          console.log('User blocked successfully:', response);
          this.store.dispatch(fetchUsersAPI());
        },
        error: (error) => {
          console.error('Error blocking user:', error);
        }
      });
    }
  
    unblockUser(userId: string): void {
      console.log('helllo');
      if (!userId) {
        console.error('User ID is required');
        return;
      }
      console.log(userId);
      this.unblockUserSubscription = this.adminService.unblockUser(userId).subscribe({
        next: (response) => {
          console.log('User unblocked successfully:', response);
          this.store.dispatch(fetchUsersAPI());
        },
        error: (error) => {
          console.error('Error unblocking user:', error);
        }
      });
    }
  
    logout(){
      localStorage.removeItem('adminToken')
      this.router.navigate(['/adminLogin'])
    }
   
    ngOnDestroy(): void {
      if (this.blockUserSubscription) {
        this.blockUserSubscription.unsubscribe();
      }
      if (this.unblockUserSubscription) {
        this.unblockUserSubscription.unsubscribe();
      }
    }
}
