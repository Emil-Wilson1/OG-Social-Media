import { Component, ElementRef, ViewChild } from '@angular/core';
import { ModalComponent } from '../modal/modal.component';
import { PostService } from '../../../services/post.service';
import { select, Store } from '@ngrx/store';
import { Post } from '../../../models/postModel';
import { fetchPostAPI } from '../../store/posts/post.action';
import { SelectorPostData } from '../../store/posts/post.selector';
import { map, Observable, Subscription } from 'rxjs';
import { AsyncPipe, CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ReportPostComponent } from '../report-post/report-post.component';
import { AuthService } from '../../../services/auth.service';
import { Route, Router, Routes } from '@angular/router';
import { format, parseISO } from 'date-fns';
import { PostCarouselComponent } from "../post-carousel/post-carousel.component";


@Component({
  selector: 'app-posts',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AsyncPipe,
    ModalComponent,
    ReportPostComponent,
    PostsComponent,
    PostCarouselComponent
],
  templateUrl: './posts.component.html',
  styleUrl: './posts.component.css',
})
export class PostsComponent {
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
    private userService:AuthService,
    private router:Router,
    private store: Store<{ posts: Post[] }>
  ) {}

  ngOnInit(): void {
    this.store.dispatch(fetchPostAPI());
    this.posts$ = this.store.pipe(select(SelectorPostData));
    console.log(this.posts$)
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
  goToUserProfile(userId: string): void {
    if(userId!==this.userId){
    this.userService.changeUserId(userId);
    this.router.navigate(['/user'], { queryParams: { userId: userId } });
    }else{
      this.router.navigate(['/profile']);
    }
  }
  handleCommentsCountUpdated(commentsCount: number) {
    this.postCommentsCount = commentsCount;
  }


  currentIndex: number = 0;

  prevImage(imagesLength: number) {
    this.currentIndex = (this.currentIndex === 0) ? (imagesLength - 1) : (this.currentIndex - 1);
  }

  nextImage(imagesLength: number) {
    this.currentIndex = (this.currentIndex === imagesLength - 1) ? 0 : (this.currentIndex + 1);
  }
  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  likePost(postId: string): void {
    const sub = this.postService.likePost(postId, this.userId).subscribe({
      next: () => {
        this.likedPosts.push(postId);
        this.posts$ = this.posts$.pipe(
          map((posts) =>
            posts.map((post) =>
              post._id === postId
                ? { ...post, likes: [...post.likes, this.userId] }
                : post
            )
          )
        );
      },
      error: (error) => {
        console.error('Failed to like post', error);
      },
    });
    this.subscriptions.add(sub);
  }

  unlikePost(postId: string): void {
    const sub = this.postService.unlikePost(postId, this.userId).subscribe({
      next: () => {
        this.likedPosts = this.likedPosts.filter((id) => id !== postId);
        this.posts$ = this.posts$.pipe(
          map((posts) =>
            posts.map((post) =>
              post._id === postId
                ? {
                    ...post,
                    likes: post.likes.filter((id) => id !== this.userId),
                  }
                : post
            )
          )
        );
      },
      error: (error) => {
        console.error('Failed to unlike post', error);
      },
    });
    this.subscriptions.add(sub);
  }

  isPostLiked(postId: string): boolean {
    return this.likedPosts.includes(postId);
  }

  getLikeCount(postId: string): Observable<number> {
    return this.posts$.pipe(
      map((posts) => {
        const post = posts.find((p) => p._id === postId);
        return post ? post.likes.length : 0;
      })
    );
  }

  savePost(postId: string): void {
    const sub = this.postService.savePost(postId, this.userId).subscribe({
      next: () => {
        this.savedPosts.push(postId);
        this.posts$ = this.posts$.pipe(
          map((posts) =>
            posts.map((post) =>
              post._id === postId
                ? { ...post, saved: [...post.saved, this.userId] }
                : post
            )
          )
        );
      },
      error: (error) => {
        console.error('Failed to save post', error);
      },
    });
    this.subscriptions.add(sub);
  }

  unsavePost(postId: string): void {
    const sub = this.postService.unsavePost(postId, this.userId).subscribe({
      next: () => {
        this.savedPosts = this.savedPosts.filter((id) => id !== postId);
        this.posts$ = this.posts$.pipe(
          map((posts) =>
            posts.map((post) =>
              post._id === postId
                ? {
                    ...post,
                    saved: post.saved.filter((id) => id !== this.userId),
                  }
                : post
            )
          )
        );
      },
      error: (error) => {
        console.error('Failed to unsave post', error);
      },
    });
    this.subscriptions.add(sub);
  }

  isPostSaved(postId: string): boolean {
    return this.savedPosts.includes(postId);
  }

  formatCreatedAt(createdAt: any): string {
    const createdAtDate = parseISO(createdAt);

    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - createdAtDate.getTime()) / 60000);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInMinutes == 0) {
      return `Just now`;
    } else if (diffInMinutes < 60) {
      return `${diffInMinutes} minutes ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours} hours ago`;
    } else if (diffInDays < 7) {
      return `${diffInDays} days ago`;
    } else {
      return format(createdAtDate, 'MMM dd, yyyy');
    }
  }
}
