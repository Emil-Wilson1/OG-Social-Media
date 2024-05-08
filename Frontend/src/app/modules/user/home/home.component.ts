
import { SelectorPostData, selectPostLikesLengthAndUserLiked } from './../../store/posts/post.selector';
import { AsyncPipe, CommonModule } from '@angular/common';
import {Component} from '@angular/core';
import { SidebarComponent } from "../sidebar/sidebar.component";
import { PostService } from '../../../services/post.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { map, Observable, take } from 'rxjs';
import { Post } from '../../models/postModel';
import { select, Store } from '@ngrx/store';
import { fetchPostAPI } from '../../store/posts/post.action';





// import * as LikeActions from '../../store/likes/like.action';



@Component({
    selector: 'app-home',
    standalone: true,
    templateUrl: './home.component.html',
    styleUrl: './home.component.css',
    imports: [SidebarComponent,CommonModule,FormsModule,ReactiveFormsModule,AsyncPipe]
})
export class HomeComponent {
  description: string = '';
  selectedFile: File | undefined;
  posts$!: Observable<Post[]>;
  userId:string=localStorage.getItem('userId') || ''
  isLiked: boolean = false;
  likedPosts: string[] = []; 
  constructor(
    private postService: PostService,
    private dialog: MatDialog,
    private store: Store<{ posts: Post[] }>,
  ) {

  }

 ngOnInit(): void {
  this.store.dispatch(fetchPostAPI());
  this.posts$ = this.store.pipe(select(SelectorPostData));
  this.posts$.subscribe(posts => {
    posts.forEach(post => {
      const postId = post._id;
      //console.log(postId);
    });
  });
  this.posts$.subscribe(posts => {
    this.likedPosts = posts
      .filter(post => post.likes.includes(this.userId))
      .map(post => post._id);
  });
} 
  

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }


  
  uploadPost() {
    if (!this.selectedFile) {
      console.error('No image selected or processed');
      return;
    }
  
    const formData = new FormData();
    formData.append('image', this.selectedFile);
    formData.append('description', this.description);
    const userId = localStorage.getItem('userId') || '';
  
    this.postService.uploadPost(userId, formData).subscribe({
      next: (response) => {
        console.log('Post uploaded successfully', response);
        this.selectedFile = undefined;
        this.description = '';
        // Handle success, show a success message, etc.
      },
      error: (error) => {
        console.error('Failed to upload post', error);
        // Handle error, show an error message, etc.
      }
    });
  }  
  
  likePost(postId: string): void {
    this.postService.likePost(postId, this.userId).subscribe({
      next: () => {
        // Add post ID to likedPosts array
        this.likedPosts.push(postId);
        this.posts$ = this.posts$.pipe(map(posts => {
          return posts.map(post => {
            if (post._id === postId) {
              return {
                ...post,
                likes: [...post.likes, this.userId] // Add user ID to likes array
              };
            }
            return post;
          });
        }));
      },
      error: (error) => {
        console.error('Failed to like post', error);
        // Handle error, show an error message, etc.
      }
    });
  }

  unlikePost(postId: string): void {
    this.postService.unlikePost(postId, this.userId).subscribe({
      next: () => {
        // Remove post ID from likedPosts array
        this.likedPosts = this.likedPosts.filter(id => id !== postId);
        this.posts$ = this.posts$.pipe(map(posts => {
          return posts.map(post => {
            if (post._id === postId) {
              return {
                ...post,
                likes: post.likes.filter(id => id !== this.userId) // Remove user ID from likes array
              };
            }
            return post;
          });
        }));
      },
      error: (error) => {
        console.error('Failed to unlike post', error);
        // Handle error, show an error message, etc.
      }
    });
  }


  isPostLiked(postId: string): boolean {
    // Check if the post is liked by the user
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
}




