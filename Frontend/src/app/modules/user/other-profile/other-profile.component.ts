import { Component } from '@angular/core';
import { SidebarComponent } from "../sidebar/sidebar.component";
import { MyPostsComponent } from "../my-posts/my-posts.component";
import { CommonModule } from '@angular/common';
import { forkJoin, map, Observable, Subscription } from 'rxjs';
import { select, Store } from '@ngrx/store';
import { IUser } from '../../../models/userModel';
import { Post } from '../../../models/postModel';
import { fetchPostAPI } from '../../store/posts/post.action';
import { SelectorPostData } from '../../store/posts/post.selector';
import { SelectorData } from '../../store/user/user.selector';
import { AuthService } from '../../../services/auth.service';
import { fetchUserAPI } from '../../store/user/user.action';
import { ActivatedRoute } from '@angular/router';
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

  constructor(
    private store: Store<{ user: IUser[] }>, 
    private stored: Store<{ posts: Post[] }>,
    private userService: AuthService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.userId = params['userId'];
      if (this.userId) {
        this.store.dispatch(fetchUserAPI({ id: this.userId }));
        this.user$ = this.store.pipe(select(SelectorData)) as Observable<IUser[]>;
        this.stored.dispatch(fetchPostAPI());
        this.posts$ = this.stored.pipe(select(SelectorPostData));
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
    if (this.currentUser) {
      if (this.isUserFollowed(followerId)) {
        this.unfollowUser(followerId);
      } else {
        this.followUser(followerId);
      }
    }
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
      },
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
}

