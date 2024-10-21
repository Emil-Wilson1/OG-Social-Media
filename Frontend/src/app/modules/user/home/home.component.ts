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



  
}


}
