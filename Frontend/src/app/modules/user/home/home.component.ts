import { SelectorPostData } from './../../store/posts/post.selector';
import { AsyncPipe, CommonModule } from '@angular/common';
import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { PostService } from '../../../services/post.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { map, Observable, of, Subscription, take } from 'rxjs';
import { Post } from '../../../models/postModel';
import { select, Store } from '@ngrx/store';
import { fetchPostAPI } from '../../store/posts/post.action';
import { ImageCropperComponent, ImageCropperModule } from 'ngx-image-cropper';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { ModalComponent } from '../modal/modal.component';
import { ReportPostComponent } from '../report-post/report-post.component';
import { PostsComponent } from '../posts/posts.component';
import { SuggestionsComponent } from '../suggestions/suggestions.component';
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
    PostsComponent,
    SuggestionsComponent 
  ],
})
export class HomeComponent {
  // description: string = '';
  // selectedFile!: File | null;
  // posts$!: Observable<Post[]>;
  // userId: string = localStorage.getItem('userId') || '';
  // isLiked: boolean = false;
  // likedPosts: string[] = [];
  // croppedImage: any = '';
  // imageChangedEvent: any = '';
  // postCommentsCount: number = 0; // Initialize with a default value
  // savedPosts: string[] = [];
  // showModal: boolean = false; 
  // private uploadPostSubscription!: Subscription;

  // @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  // @ViewChild(ImageCropperComponent) imageCropper!: ImageCropperComponent;
  // @ViewChild(ModalComponent) modal!: ModalComponent;

  // constructor(
  //   private postService: PostService,
  //   private store: Store<{ posts: Post[] }>,
  // ) {}

  // ngOnInit(): void {
  //   this.store.dispatch(fetchPostAPI());
  //   this.posts$ = this.store.pipe(select(SelectorPostData));
  //   this.posts$.subscribe((posts) => {
  //     this.savedPosts = posts
  //       .filter((post) => post.saved.includes(this.userId))
  //       .map((post) => post._id);
  //     //console.log(postId);
  //   });
  //   this.posts$.subscribe((posts) => {
  //     this.likedPosts = posts
  //       .filter((post) => post.likes.includes(this.userId))
  //       .map((post) => post._id);
  //   });
  // }

  // cancelImageSelection() {
  //     this.selectedFile = null;
  //     this.imageChangedEvent = null;
  // }
  // handleCommentsCountUpdated(commentsCount: number) {
  //   this.postCommentsCount = commentsCount;
  // }

  // imageCropped(event: ImageCroppedEvent) {
  //   if (event.blob) {
  //     let fileType = 'image/jpeg';
  //     if (this.selectedFile && this.selectedFile.type.startsWith('image/png')) {
  //       fileType = 'image/png';
  //     } else if (
  //       this.selectedFile &&
  //       this.selectedFile.type.startsWith('image/webp')
  //     ) {
  //       fileType = 'image/webp';
  //     }
  //     const imageFile = new File([event.blob], 'image' ,{
  //       type: fileType,
  //     });
  //     this.croppedImage = imageFile;
  //     console.log("Hello hai");
  //   }
  // }

  
  // onFileSelected(event: any): void {
  //   console.log('Selected file:', event.target.files[0]);
  //   if (
  //     this.selectedFile &&
  //     !['image/jpeg', 'image/png', 'image/webp'].includes(
  //       this.selectedFile.type
  //     )
  //   ) {
  //     console.error(
  //       'Selected file format is not supported. Please select a JPEG, PNG, or WEBP image.'
  //     );
  //     this.selectedFile = null;
  //     this.fileInput.nativeElement.value = ''; 
  //   }
  //   this.imageChangedEvent = event;
  //   this.showModal = true;
  // }

  
  

  // cropperReady() {
  //   console.log('Cropper ready');
  // }

  // loadImageFailed() {
  //   console.log('Load image failed');
  // }

  // uploadPost(fileInput: HTMLInputElement) {
  //   if (!this.croppedImage) {
  //     console.error('No image selected or processed');
  //     return;
  //   }

  //   const formData = new FormData();
  //   formData.append('image', this.croppedImage);
  //   formData.append('description', this.description);
  //   const userId = localStorage.getItem('userId') || '';

  //   this.uploadPostSubscription = this.postService.uploadPost(userId, formData).subscribe({
  //     next: (response) => {
  //       console.log('Post uploaded successfully', response);
  //       this.store.dispatch(fetchPostAPI());
  //       this.selectedFile = null;
  //       this.description = '';
  //       this.croppedImage = null;
  //       this.imageChangedEvent = null;
  //       fileInput.value = '';
  //     },
  //     error: (error) => {
  //       console.error('Failed to upload post', error);
  //     },
  //   });
  // }

  // ngOnDestroy(): void {
  //   if (this.uploadPostSubscription) {
  //     this.uploadPostSubscription.unsubscribe();
  //   }
  // }

  description: string = '';
  posts$!: Observable<Post[]>;
  userId: string = localStorage.getItem('userId') || '';
  isLiked: boolean = false;
  likedPosts: string[] = [];
  selectedFiles: File[] = [];
  croppedImages: any[] = [];
  imageChangedEvents: any[] = [];
  currentImageIndex: number = 0;
  postCommentsCount: number = 0;
  savedPosts: string[] = [];
  showModal: boolean = false;
  private uploadPostSubscription!: Subscription;

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  constructor(
    private postService: PostService,
    private store: Store<{ posts: Post[] }>,
    private elementRef: ElementRef
  ) {}

  ngOnInit(): void {
    this.store.dispatch(fetchPostAPI());
    this.posts$ = this.store.pipe(select(SelectorPostData));
    this.posts$.subscribe((posts) => {
      this.savedPosts = posts
        .filter((post) => post.saved.includes(this.userId))
        .map((post) => post._id);
    });
    this.posts$.subscribe((posts) => {
      this.likedPosts = posts
        .filter((post) => post.likes.includes(this.userId))
        .map((post) => post._id);
    });
  }

  cancelImageSelection() {
    this.selectedFiles = [];
    this.imageChangedEvents = [];
    this.croppedImages = [];
    this.currentImageIndex = 0;
  }

  onFilesSelected(event: any): void {
    const files: File[] = Array.from(event.target.files);
    this.selectedFiles = files;
    this.imageChangedEvents = files.map(file => ({
      target: {
        files: [file]
      }
    }));
    this.showModal = true;
  }

  prevImage() {
    if (this.currentImageIndex > 0) {
      this.currentImageIndex--;
    }
  }

  nextImage() {
    if (this.currentImageIndex < this.imageChangedEvents.length - 1) {
      this.currentImageIndex++;
    }
  }

  imageCropped(event: ImageCroppedEvent, index: number) {
    if (event.blob) {
      let fileType = 'image/jpeg';
      const file = this.selectedFiles[index];
      if (file && file.type.startsWith('image/png')) {
        fileType = 'image/png';
      } else if (file && file.type.startsWith('image/webp')) {
        fileType = 'image/webp';
      }
      const imageFile = new File([event.blob], 'image', {
        type: fileType,
      });
      this.croppedImages[index] = imageFile;
    }
  }

  cropperReady() {
    console.log('Cropper ready');
  }

  loadImageFailed() {
    console.log('Load image failed');
  }
// Add a loading indicator property
isLoading: boolean = false;

uploadPost(fileInput: HTMLInputElement) {
  if (this.croppedImages.length === 0) {
    console.error('No images selected or processed');
    return;
  }

  // Start loading indicator
  this.isLoading = true;

  const formData = new FormData();
  this.croppedImages.forEach((image, index) => {
    formData.append('images', image, `image${index}`);
  });
  formData.append('description', this.description);
  const userId = localStorage.getItem('userId') || '';

  this.uploadPostSubscription = this.postService.uploadPost(userId, formData).subscribe({
    next: (response) => {
      console.log('Post uploaded successfully', response);
      this.store.dispatch(fetchPostAPI());
      this.cancelImageSelection();
      this.description = '';
      fileInput.value = '';
    },
    error: (error) => {
      console.error('Failed to upload post', error);
    },
    complete: () => {
      // Stop loading indicator when complete
      this.isLoading = false;
    }
  });
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
  ngOnDestroy(): void {
    if (this.uploadPostSubscription) {
      this.uploadPostSubscription.unsubscribe();
    }



  // likePost(postId: string): void {
  //   this.postService.likePost(postId, this.userId).subscribe({
  //     next: () => {
  //       // Add post ID to likedPosts array
  //       this.likedPosts.push(postId);
  //       this.posts$ = this.posts$.pipe(
  //         map((posts) => {
  //           return posts.map((post) => {
  //             if (post._id === postId) {
  //               return {
  //                 ...post,
  //                 likes: [...post.likes, this.userId], // Add user ID to likes array
  //              };
  //             }
  //             return post;
  //           });
  //         })
  //       );
  //     },
  //     error: (error) => {
  //       console.error('Failed to like post', error);
  //       // Handle error, show an error message, etc.
  //     },
  //   });
  // }

  // unlikePost(postId: string): void {
  //   this.postService.unlikePost(postId, this.userId).subscribe({
  //     next: () => {
  //       // Remove post ID from likedPosts array
  //       this.likedPosts = this.likedPosts.filter((id) => id !== postId);

  //       this.posts$ = this.posts$.pipe(
  //         map((posts) => {
  //           return posts.map((post) => {
  //             if (post._id === postId) {
  //               return {
  //                 ...post,
  //                 likes: post.likes.filter((id) => id !== this.userId), // Remove user ID from likes array
  //               };
  //             }
  //             return post;
  //           });
  //         })
  //       );
  //     },
  //     error: (error) => {
  //       console.error('Failed to unlike post', error);
  //       // Handle error, show an error message, etc.
  //     },
  //   });
  // }

  // isPostLiked(postId: string): boolean {
  //   // Check if the post is liked by the user
  //   return this.likedPosts.includes(postId);
  // }

  // getLikeCount(postId: string): Observable<number> {
  //   return this.posts$.pipe(
  //     map((posts) => {
  //       const post = posts.find((p) => p._id === postId);
  //       return post ? post.likes.length : 0;
  //     })
  //   );
  // }

  // savePost(postId: string): void {
  //   this.postService.savePost(postId, this.userId).subscribe({
  //     next: () => {
  //       // Add post ID to savedPosts array
  //       this.savedPosts.push(postId);
  //       this.posts$ = this.posts$.pipe(
  //         map((posts) => {
  //           return posts.map((post) => {
  //             if (post._id === postId) {
  //               return {
  //                 ...post,
  //                 saved: [...post.saved, this.userId], // Add user ID to saved array
  //               };
  //             }
  //             return post;
  //           });
  //         })
  //       );
  //     },
  //     error: (error) => {
  //       console.error('Failed to save post', error);
  //       // Handle error, show an error message, etc.
  //     },
  //   });
  // }

  // unsavePost(postId: string): void {
  //   this.postService.unsavePost(postId, this.userId).subscribe({
  //     next: () => {
  //       // Remove post ID from savedPosts array
  //       this.savedPosts = this.savedPosts.filter((id) => id !== postId);
  //       this.posts$ = this.posts$.pipe(
  //         map((posts) => {
  //           return posts.map((post) => {
  //             if (post._id === postId) {
  //               return {
  //                 ...post,
  //                 saved: post.saved.filter((id) => id !== this.userId), // Remove user ID from saved array
  //               };
  //             }
  //             return post;
  //           });
  //         })
  //       );
  //     },
  //     error: (error) => {
  //       console.error('Failed to unsave post', error);
  //       // Handle error, show an error message, etc.
  //     },
  //   });
  // }

  // isPostSaved(postId: string): boolean {
  //   return this.savedPosts.includes(postId);
  // }

}


}
