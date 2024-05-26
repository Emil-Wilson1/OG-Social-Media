import { Component } from '@angular/core';
import { SidebarComponent } from "../sidebar/sidebar.component";
import { MyPostsComponent } from "../my-posts/my-posts.component";
import { CommonModule } from '@angular/common';
import { map, Observable, Subscription } from 'rxjs';
import { select, Store } from '@ngrx/store';
import { IUser } from '../../../models/userModel';
import { Post } from '../../../models/postModel';

import { fetchPostAPI } from '../../store/posts/post.action';
import { SelectorPostData } from '../../store/posts/post.selector';
import { SelectorData } from '../../store/user/user.selector';
import { AuthService } from '../../../services/auth.service';
import { fetchUserAPI } from '../../store/user/user.action';
import { ActivatedRoute } from '@angular/router';

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
  userId: string = localStorage.getItem('userId') || '';
  user!: string;
  followedUsers: string[] = [];
  private subscriptions = new Subscription();

  constructor(
    private store: Store<{ user: IUser[] }>, 
    private stored: Store<{ posts: Post[] }>,
    private userService: AuthService ,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const userId = params['userId'];
      if (userId) {
        this.store.dispatch(fetchUserAPI({ id: userId }));
        this.user$ = this.store.select(SelectorData);
        this.stored.dispatch(fetchPostAPI());
        this.posts$ = this.stored.pipe(select(SelectorPostData));
      }
    });
  }


  open(): void {
    this.show = true;
  }

  getUserPosts(userId: string): Observable<any> {
    return this.posts$.pipe(
      map(posts => posts.filter(post => post.userId === userId))
    );
  }



  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  followUser(followerId: string): void {
    const sub = this.userService.followUser(this.userId, followerId).subscribe({
      next: () => {
        this.followedUsers.push(followerId);
        this.user$ = this.user$.pipe(
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
    const sub = this.userService.unfollowUser(this.userId, followerId).subscribe({
      next: () => {
        this.followedUsers = this.followedUsers.filter((id) => id !== followerId);
        this.user$ = this.user$.pipe(
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





