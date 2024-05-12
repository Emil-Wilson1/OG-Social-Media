import {SelectorPostData} from './../../store/posts/post.selector';
import 'hammerjs';
import { AsyncPipe, CommonModule } from '@angular/common';
import { Component,  ElementRef,  HostListener,  ViewChild } from '@angular/core';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { PostService } from '../../../services/post.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { map, Observable, of, take } from 'rxjs';
import { Post } from '../../models/postModel';
import { select, Store } from '@ngrx/store';
import { fetchPostAPI } from '../../store/posts/post.action';
import { ImageCropperComponent, ImageCropperModule } from 'ngx-image-cropper';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ModalComponent } from "../modal/modal.component";
import moment from 'moment';
import { ReportPostComponent } from '../report-post/report-post.component';
import { PostsComponent } from '../posts/posts.component';
@Component({
    selector: 'app-home',
    standalone: true,
    templateUrl: './home.component.html',
    styleUrl: './home.component.css',
    imports: [
        SidebarComponent,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        AsyncPipe,
        ImageCropperModule,
        ModalComponent,
        ReportPostComponent,
        PostsComponent 
    ]
})
export class HomeComponent {
  description: string = '';
  selectedFile!: File | null;
  posts$!: Observable<Post[]>;
  userId: string = localStorage.getItem('userId') || '';
  isLiked: boolean = false;
  likedPosts: string[] = [];
  croppedImage: any = '';
  imageChangedEvent: any = '';
  postCommentsCount: number = 0; // Initialize with a default value
  savedPosts: string[] = [];

  @ViewChild(ImageCropperComponent) imageCropper!: ImageCropperComponent;
  @ViewChild(ModalComponent) modal!: ModalComponent;
  constructor(
    private postService: PostService,
    private dialog: MatDialog,
    private store: Store<{ posts: Post[] }>,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.store.dispatch(fetchPostAPI());
    this.posts$ = this.store.pipe(select(SelectorPostData));
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
    // You can perform any additional operations with the updated comments count here
  }


  imageCropped(event: ImageCroppedEvent) {
    if (event.blob) {
      const imageFile = new File([event.blob], 'cropped-image.jpg', {
        type: 'image/jpeg',
      });
      this.croppedImage = imageFile;
    }
  }
  onFileSelected(event: any): void {
    console.log('Selected file:', event.target.files[0]);
    this.imageChangedEvent = event;
  }

  cropperReady() {
    console.log('Cropper ready');
  }

  loadImageFailed() {
    console.log('Load image failed');
    // Show an error message or handle the failure case
  }

  uploadPost(fileInput: HTMLInputElement) {
    if (!this.croppedImage) {
      console.error('No image selected or processed');
      return;
    }

    const formData = new FormData();
    formData.append('image', this.croppedImage);
    formData.append('description', this.description);
    const userId = localStorage.getItem('userId') || '';

    this.postService.uploadPost(userId, formData).subscribe({
      next: (response) => {
        console.log('Post uploaded successfully', response);
        this.store.dispatch(fetchPostAPI());
        this.selectedFile = null;
        this.description = '';
        this.croppedImage = null;
        this.imageChangedEvent = null;
        fileInput.value = '';
        // Handle success, show a success message, etc.
      },
      error: (error) => {
        console.error('Failed to upload post', error);
        // Handle error, show an error message, etc.
      },
    });
  }

  likePost(postId: string): void {
    this.postService.likePost(postId, this.userId).subscribe({
      next: () => {
        // Add post ID to likedPosts array
        this.likedPosts.push(postId);
        this.posts$ = this.posts$.pipe(
          map((posts) => {
            return posts.map((post) => {
              if (post._id === postId) {
                return {
                  ...post,
                  likes: [...post.likes, this.userId], // Add user ID to likes array
                };
              }
              return post;
            });
          })
        );
      },
      error: (error) => {
        console.error('Failed to like post', error);
        // Handle error, show an error message, etc.
      },
    });
  }

  unlikePost(postId: string): void {
    this.postService.unlikePost(postId, this.userId).subscribe({
      next: () => {
        // Remove post ID from likedPosts array
        this.likedPosts = this.likedPosts.filter((id) => id !== postId);
        
        this.posts$ = this.posts$.pipe(
          map((posts) => {
            return posts.map((post) => {
              if (post._id === postId) {
                return {
                  ...post,
                  likes: post.likes.filter((id) => id !== this.userId), // Remove user ID from likes array
                };
              }
              return post;
            });
          })
        );
      },
      error: (error) => {
        console.error('Failed to unlike post', error);
        // Handle error, show an error message, etc.
      },
    });
  }

  isPostLiked(postId: string): boolean {
    // Check if the post is liked by the user
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
    this.postService.savePost(postId, this.userId).subscribe({
      next: () => {
        // Add post ID to savedPosts array
        this.savedPosts.push(postId);
        this.posts$ = this.posts$.pipe(
          map((posts) => {
            return posts.map((post) => {
              if (post._id === postId) {
                return {
                  ...post,
                  saved: [...post.saved, this.userId], // Add user ID to saved array
                };
              }
              return post;
            });
          })
        );
      },
      error: (error) => {
        console.error('Failed to save post', error);
        // Handle error, show an error message, etc.
      },
    });
  }
  
  unsavePost(postId: string): void {
    this.postService.unsavePost(postId, this.userId).subscribe({
      next: () => {
        // Remove post ID from savedPosts array
        this.savedPosts = this.savedPosts.filter((id) => id !== postId);
        this.posts$ = this.posts$.pipe(
          map((posts) => {
            return posts.map((post) => {
              if (post._id === postId) {
                return {
                  ...post,
                  saved: post.saved.filter((id) => id !== this.userId), // Remove user ID from saved array
                };
              }
              return post;
            });
          })
        );
      },
      error: (error) => {
        console.error('Failed to unsave post', error);
        // Handle error, show an error message, etc.
      },
    });
  }

  isPostSaved(postId: string): boolean {
    return this.savedPosts.includes(postId);
  }

  
  formatCreatedAt(createdAt: any): any {
    // Parse the createdAt string using moment.js
    const createdAtDate = moment(createdAt);

    // Calculate the difference between the createdAt date and the current date
    const now = moment();
    const diffInMinutes = now.diff(createdAtDate, 'minutes');
    const diffInHours = now.diff(createdAtDate, 'hours');
    const diffInDays = now.diff(createdAtDate, 'days');

    // Choose the appropriate format based on the time difference
    if (diffInMinutes == 0) {
      return `Just now`;
    } else if (diffInMinutes < 60) {
      return `${diffInMinutes} minutes ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours} hours ago`;
    } else if (diffInDays < 7) {
      return `${diffInDays} days ago`;
    } else {
      return createdAtDate.format('MMM DD, YYYY'); // Fallback to a standard date format
    }
  }

}