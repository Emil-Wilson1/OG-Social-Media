import { Component } from '@angular/core';
import { map, Observable, Subscription } from 'rxjs';
import { IUser } from '../../../models/userModel';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { fetchUsersAPI } from '../../store/admin/admin.action';
import { userSelectorData } from '../../store/admin/admin.selector';
import { AsyncPipe, CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-suggestions',
  standalone: true,
  imports: [AsyncPipe,CommonModule],
  templateUrl: './suggestions.component.html',
  styleUrl: './suggestions.component.css'
})
export class SuggestionsComponent {
  users$!: Observable<IUser[]>;
  userId!: string;
  followedUsers: string[] = [];
  private subscriptions = new Subscription();

  constructor(
    private store: Store<{ allUser: IUser[] }>,
    private router: Router,
    private userService: AuthService,
  ) {}

  ngOnInit(): void {
    this.userId = localStorage.getItem('userId') || ''; 
    this.store.dispatch(fetchUsersAPI());
    this.users$ = this.store.select(userSelectorData).pipe(
      map(users => users.filter(user => user._id !== this.userId))
    );
    this.users$.subscribe((users) => {
      this.followedUsers = users
        .filter((user) => user.followers.includes(this.userId))
        .map((user) => user._id);

        this.users$ = this.store.select(userSelectorData).pipe(
          map(users => users.filter(user => user._id !== this.userId && !this.followedUsers.includes(user._id)))
        );
    });

    
  }



  goToUserProfile(userId: string): void {
    if(userId!==this.userId){
    this.userService.changeUserId(userId);
    this.router.navigate(['/user'], { queryParams: { userId: userId } });
    }else{
      this.router.navigate(['/profile']);
    }
  }

  followOrUnfollowUser(followerId: string): void {
    if (this.userId) {
      if (this.isUserFollowed(followerId)) {
        this.unfollowUser(followerId);
      } else {
        this.followUser(followerId);
      }
    }
  }

  followUser(followerId: string): void {
    const sub = this.userService.followUser(followerId, this.userId).subscribe({
      next: () => {
        this.followedUsers.push(followerId);
        this.users$ = this.users$.pipe(
          map((users) =>
            users.map((user) =>
              user._id === followerId
                ? { ...user, followers: [...user.followers, this.userId] }
                : user
            )
          )
        );
      },
      error: (error) => {
        console.error('Failed to follow user', error);
      },
    });
    this.subscriptions.add(sub);
  }

  unfollowUser(followerId: string): void {
    const sub = this.userService.unfollowUser(followerId, this.userId).subscribe({
      next: () => {
        this.followedUsers = this.followedUsers.filter((id) => id !== followerId);
        this.users$ = this.users$.pipe(
          map((users) =>
            users.map((user) =>
              user._id === followerId
                ? { ...user, followers: user.followers.filter((id) => id !== this.userId) }
                : user
            )
          )
        );
      },
      error: (error) => {
        console.error('Failed to unfollow user', error);
      },
    });
    this.subscriptions.add(sub);
  }

  isUserFollowed(followerId: string): boolean {
    return this.followedUsers.includes(followerId);
  }


  
  getMutualConnections(user: any): number {
    return user.following.filter((followedUserId: string) => followedUserId !== this.userId && user.following.includes(followedUserId)).length;
  }
}
