import { Component, ViewChild } from '@angular/core';
import { map, Observable, Subscription } from 'rxjs';
import { Post } from '../../../models/postModel';
import { ModalComponent } from '../modal/modal.component';
import { PostService } from '../../../services/post.service';
import { select, Store } from '@ngrx/store';
import { fetchPostAPI } from '../../store/posts/post.action';
import {
  SelectorPostData,
  selectUserPosts,
} from '../../store/posts/post.selector';
import moment from 'moment';
import { AsyncPipe, CommonModule } from '@angular/common';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { EditDelPostComponent } from '../edit-del-post/edit-del-post.component';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-my-posts',
  standalone: true,
  imports: [
    CommonModule,
    AsyncPipe,
    SidebarComponent,
    ModalComponent,
    EditDelPostComponent,
    ReactiveFormsModule,
    MyPostsComponent,
  ],
  templateUrl: './my-posts.component.html',
  styleUrl: './my-posts.component.css',
})
export class MyPostsComponent {
  posts$!: Observable<Post[]>;
  userId: string = localStorage.getItem('userId') || '';
  isLiked: boolean = false;
  likedPosts: string[] = [];
  postCommentsCount: number = 0; 
  savedPosts: string[] = [];
  private subscriptions: Subscription = new Subscription();

  @ViewChild(ModalComponent) modal!: ModalComponent;
  constructor(
    private postService: PostService,
    private store: Store<{ posts: Post[] }>
  ) {}

  ngOnInit(): void {
    this.store.dispatch(fetchPostAPI());
    this.posts$ = this.store.pipe(select(selectUserPosts));
    this.posts$.subscribe((posts) => {
      this.savedPosts = posts
        .filter((post) => post.saved.includes(this.userId))
        .map((post) => post._id);
      //console.log(postId);
    });
    this.posts$.subscribe((posts) => {
      this.likedPosts = posts
        .filter((post) => post.likes.includes(this.userId))
        .map((post) => post._id);
    });
  }

  handleCommentsCountUpdated(commentsCount: number) {
    this.postCommentsCount = commentsCount;
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  likePost(postId: string): void {
    const sub = this.postService.likePost(postId, this.userId).subscribe({
      next: () => {
        this.likedPosts.push(postId);
        this.posts$ = this.posts$.pipe(
          map(posts => posts.map(post => post._id === postId ? { ...post, likes: [...post.likes, this.userId] } : post))
        );
      },
      error: (error) => {
        console.error('Failed to like post', error);
      }
    });
    this.subscriptions.add(sub);
  }

  unlikePost(postId: string): void {
    const sub = this.postService.unlikePost(postId, this.userId).subscribe({
      next: () => {
        this.likedPosts = this.likedPosts.filter(id => id !== postId);
        this.posts$ = this.posts$.pipe(
          map(posts => posts.map(post => post._id === postId ? { ...post, likes: post.likes.filter(id => id !== this.userId) } : post))
        );
      },
      error: (error) => {
        console.error('Failed to unlike post', error);
      }
    });
    this.subscriptions.add(sub);
  }

  isPostLiked(postId: string): boolean {
    return this.likedPosts.includes(postId);
  }

  getLikeCount(postId: string): Observable<number> {
    return this.posts$.pipe(
      map(posts => {
        const post = posts.find(p => p._id === postId);
        return post ? post.likes.length : 0;
      })
    );
  }

  savePost(postId: string): void {
    const sub = this.postService.savePost(postId, this.userId).subscribe({
      next: () => {
        this.savedPosts.push(postId);
        this.posts$ = this.posts$.pipe(
          map(posts => posts.map(post => post._id === postId ? { ...post, saved: [...post.saved, this.userId] } : post))
        );
      },
      error: (error) => {
        console.error('Failed to save post', error);
      }
    });
    this.subscriptions.add(sub);
  }

  unsavePost(postId: string): void {
    const sub = this.postService.unsavePost(postId, this.userId).subscribe({
      next: () => {
        this.savedPosts = this.savedPosts.filter(id => id !== postId);
        this.posts$ = this.posts$.pipe(
          map(posts => posts.map(post => post._id === postId ? { ...post, saved: post.saved.filter(id => id !== this.userId) } : post))
        );
      },
      error: (error) => {
        console.error('Failed to unsave post', error);
      }
    });
    this.subscriptions.add(sub);
  }

  isPostSaved(postId: string): boolean {
    return this.savedPosts.includes(postId);
  }

  formatCreatedAt(createdAt: any): any {
    const createdAtDate = moment(createdAt);

    const now = moment();
    const diffInMinutes = now.diff(createdAtDate, 'minutes');
    const diffInHours = now.diff(createdAtDate, 'hours');
    const diffInDays = now.diff(createdAtDate, 'days');

    if (diffInMinutes == 0) {
      return `Just now`;
    } else if (diffInMinutes < 60) {
      return `${diffInMinutes} minutes ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours} hours ago`;
    } else if (diffInDays < 7) {
      return `${diffInDays} days ago`;
    } else {
      return createdAtDate.format('MMM DD, YYYY');
    }
  }
}
