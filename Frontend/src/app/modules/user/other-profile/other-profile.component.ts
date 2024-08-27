import { Component, ElementRef, HostListener } from '@angular/core';
import { SidebarComponent } from "../sidebar/sidebar.component";
import { MyPostsComponent } from "../my-posts/my-posts.component";
import { CommonModule } from '@angular/common';
import {  map, Observable, Subscription, take } from 'rxjs';
import { select, Store } from '@ngrx/store';
import { IUser } from '../../../models/userModel';
import { Post } from '../../../models/postModel';
import { fetchPostAPI } from '../../store/posts/post.action';
import { SelectorPostData } from '../../store/posts/post.selector';
import { SelectorData } from '../../store/user/user.selector';
import { AuthService } from '../../../services/auth.service';
import { fetchUserAPI } from '../../store/user/user.action';
import { ActivatedRoute, Router } from '@angular/router';
import { userSelectorData } from '../../store/admin/admin.selector';
import { fetchUsersAPI } from '../../../modules/store/admin/admin.action';

@Component({
    selector: 'app-other-profile',
    standalone: true,
    templateUrl: './other-profile.component.html',
    styleUrl: './other-profile.component.css',
    imports: [SidebarComponent, MyPostsComponent,CommonModule]
})
export class OtherProfileComponent {
  user$!: Observable<IUser[]>;
  posts$!: Observable<Post[]>;
  show: boolean = false;
  currentUser = localStorage.getItem('userId') || '';
  followedUsers: string[] = [];
  private subscriptions = new Subscription();
  userId!: string;
  modalOpen: boolean = false;
  modalTitle: string = '';
  modalUsers: IUser[] = [];
  users$!: Observable<IUser[]>;
  isPrivate: boolean = false; // Initialize with default value
  isFollower: boolean = false;
  constructor(
    private store: Store<{ user: IUser[] }>, 
    private stored: Store<{ posts: Post[] }>,
    private userService: AuthService,
    private route: ActivatedRoute,
    private router:Router,
    private elementRef:ElementRef
  ) { }

  ngOnInit(): void {
    this.initializeData()
  }


  initializeData():void{
    this.route.queryParams.subscribe(params => {
      this.userId = params['userId'];
      if (this.userId) {
        this.store.dispatch(fetchUserAPI({ id: this.userId }));
        this.user$ = this.store.pipe(select(SelectorData)) as Observable<IUser[]>;
        this.store.dispatch(fetchPostAPI());
        this.posts$ = this.store.pipe(select(SelectorPostData));

        // Subscribe to user$ observable to update isPrivate and isFollower
        this.user$.subscribe(users => {
          const currentUser = users.find(user => user._id === this.userId);
          if (currentUser) {
            this.isPrivate = currentUser.isPrivate; // Assuming isPrivate is a boolean in IUser interface
    
            // Check if currentUser is a follower
            if (currentUser.followers && currentUser.followers.includes(this.currentUser)) {
              this.isFollower = true;
            } else {
              this.isFollower = false;
            }
          }
        });
      }
    });
    
    this.user$.subscribe(users => {
      // Check if currentUser is in any followRequests
      const currentUserRequested = users.some(user => user.followRequests.includes(this.currentUser));
    
      // Update followRequests based on boolean condition
      if (currentUserRequested) {
        // If currentUser is found in followRequests, set this.followRequests to true or update as needed
        this.followRequests = users.flatMap(user => user.followRequests); // Example usage
      } else {
        // Handle other scenarios if necessary
        this.followRequests = [];
      }
    });
      
    this.user$.subscribe((users) => {
      this.followedUsers = users
        .filter((user) => user.followers.includes(this.currentUser))
        .map((user) => user._id);
    });
    this.store.dispatch(fetchUsersAPI());
    this.users$ = this.store.select(userSelectorData);
  }


  open(): void {
    this.show = true;
  }

  getUserPosts(userId: string): Observable<Post[]> {
    return this.posts$.pipe(
      map(posts => posts.filter(post => post.userId === userId))
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
  followOrUnfollowUser(followerId: string): void {
    if (this.isUserFollowed(followerId)) {
      this.unfollowUser(followerId);
    } else {
      if (this.followRequests.includes(this.currentUser)) {
        this.cancelFollowRequest(followerId); // Cancel the follow request if already requested
      } else {
        this.isUserPrivate(followerId).pipe(
          take(1)
        ).subscribe((isPrivate) => {
          if (isPrivate) {
            this.sendFollowRequest(followerId);
          } else {
            this.followUser(followerId);
          }
        });
      }
    }
  }
sendFollowRequest(followerId: string): void {
  const sub = this.userService.sendFollowRequest(followerId, this.currentUser).subscribe({
    next: () => {
      console.log('Follow request sent');
      this.followRequests.push(this.currentUser);
    },
    error: (error) => {
      console.error('Failed to send follow request', error);
    }
  });
  this.subscriptions.add(sub);
}
cancelFollowRequest(followerId: string): void {
  // Assuming you have a method in userService to cancel the follow request
  const sub = this.userService.cancelFollowRequest(followerId, this.currentUser).subscribe({
    next: () => {
      console.log('Follow request canceled');
      this.followRequests = this.followRequests.filter(id => id !== this.currentUser);
    },
    error: (error) => {
      console.error('Failed to cancel follow request', error);
    }
  });
  this.subscriptions.add(sub);
}

  followUser(followerId: string): void {
    const sub = this.userService.followUser(followerId, this.currentUser).subscribe({
      next: () => {
        this.followedUsers.push(followerId);
        this.user$ = this.user$.pipe(
          map((users) =>
            users.map((user) =>
              user._id === followerId
                ? { ...user, followers: [...user.followers, this.currentUser] }
                : user
            )
          )
        );
      },
      error: (error) => {
        console.error('Failed to follow user', error);
      }
    });
    this.subscriptions.add(sub);
  }

  unfollowUser(followerId: string): void {
    const sub = this.userService.unfollowUser(followerId, this.currentUser).subscribe({
      next: () => {
        this.followedUsers = this.followedUsers.filter((id) => id !== followerId);
        this.user$ = this.user$.pipe(
          map((users) =>
            users.map((user) =>
              user._id === followerId
                ? { ...user, followers: user.followers.filter((id) => id !== this.currentUser) }
                : user
            )
          )
        );
        this.initializeData()
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

  isUserPrivate(userId: string): Observable<boolean> {
    return this.user$.pipe(
      map((users) => {
        const user = users.find(user => user._id === userId);
        return user ? user.isPrivate : false;
      })
    );
  }
  followRequests: string[] = [];

  getButtonText(userId: string): string{
    if (this.isUserFollowed(userId)) {
      return 'Unfollow';
    } else if (this.followRequests.includes(this.currentUser)) {
      return 'Requested';
    } else {
      return 'Follow';
    }
  }
  sidebarOpen: boolean = false;

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }
  
  @HostListener('document:click', ['$event'])
  onClick(event: MouseEvent) {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      // Clicked outside the sidebar; close it if open
      this.sidebarOpen = false;
    }
  }
  openModal(userIds: string[], title: string): void {
    console.log("User IDs:", userIds);
    this.users$.subscribe({
      next: (users) => {
        console.log("Original Users:", users);
        this.modalUsers = users.filter(user => userIds.includes(user._id));
        console.log("Modal Users:", this.modalUsers);
        this.modalTitle = title; 
        this.modalOpen = true; 
      },
      error: (error) => {
        console.error("Error fetching users:", error);
      }
    });
  }

  closeModal(): void {
    this.modalOpen = false;
  }

  getMutualConnections(user: any): number {
    return user.following.filter((followedUserId: string) => followedUserId !== this.currentUser && user.following.includes(followedUserId)).length;
  }
  
  getMutualConnectionsIds(user: IUser): string[] {
    return user.following.filter(followedUserId => followedUserId !== this.currentUser && user.following.includes(followedUserId));
  }

  goToUserProfile(userId: string): void {
    this.modalOpen = false;
    if(userId!==this.userId){
    this.userService.changeUserId(userId);
    this.router.navigate(['/user'], { queryParams: { userId: userId } });
    }else{
      this.router.navigate(['/profile']);
    }
  }
}

