import { fetchUserAPI } from '../../store/user/user.action';


import { SelectorData } from '../../store/user/user.selector';
import { Component } from '@angular/core';
import { select, Store} from '@ngrx/store';
import { map, Observable } from 'rxjs';
import  { IUser } from '../../../models/userModel';
import { AsyncPipe, CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLinkActive } from '@angular/router';
import { SidebarComponent } from "../sidebar/sidebar.component";
import { fetchPostAPI } from '../../store/posts/post.action';
import { SelectorPostData } from '../../store/posts/post.selector';
import { Post } from '../../../models/postModel';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ModalComponent } from '../modal/modal.component';
import { PostsComponent } from '../posts/posts.component';
import { MyPostsComponent } from '../my-posts/my-posts.component';
import { SavedPostsComponent } from '../saved-posts/saved-posts.component';
import { fetchUsersAPI } from '../../store/admin/admin.action';
import { userSelectorData } from '../../store/admin/admin.selector';
import { AuthService } from '../../../services/auth.service';

@Component({
    selector: 'app-profile',
    standalone: true,
    templateUrl: './profile.component.html',
    styleUrl: './profile.component.css',
    imports: [CommonModule, AsyncPipe, RouterLinkActive, SidebarComponent,
      PostsComponent,
      FormsModule,
      ReactiveFormsModule,
      ModalComponent,
      MyPostsComponent,
      SavedPostsComponent
    ]
})
export class ProfileComponent {
  user$!: Observable<IUser[]>;
  posts$!: Observable<Post[]>;
  show: boolean=false
  userId: string = localStorage.getItem('userId') || '';
  notSaved:boolean=false
  showMyPost: boolean = false;
  showSavedPost: boolean = false;
  selectedPost: any = null;
  modalOpen: boolean = false;
  modalTitle: string = '';
  modalUsers: IUser[] = [];
  users$!: Observable<IUser[]>;
  isPrivate: boolean = false; // Assuming you have a way to determine the initial privacy setting




  constructor(
    private store: Store<{ user: IUser[] }>,
    private postStore: Store<{ posts: Post[] }>,
    private privacyService:AuthService
  ) {}

  ngOnInit(): void {
    this.store.dispatch(fetchUserAPI({ id: this.userId }));
    this.user$ = this.store.pipe(select(SelectorData));
    this.postStore.dispatch(fetchPostAPI());
    this.posts$ = this.postStore.pipe(select(SelectorPostData));
    this.store.dispatch(fetchUsersAPI());
    this.users$ = this.store.select(userSelectorData);
  }

  togglePrivacy(): void {
    this.privacyService.togglePrivacy(this.userId).subscribe(
      (response: any) => {
        console.log(response); // Log the response from the backend
        // Update the component's state or UI based on the response
        this.isPrivate = response.updatedUser.isPrivate; // Assuming the response contains the updated privacy setting
      },
      (error: any) => {
        console.error(error); // Log any errors
        // Handle errors, e.g., display an error message to the user
      }
    );
  }

  toggleShow(showSaved: boolean): void {
    this.show = showSaved;
    this.showMyPost = false;
    this.showSavedPost = false;
    this.selectedPost = null;
  }


  openPost(type: string, post: any) {
    this.selectedPost = post;
    if (type === 'my') {
      this.showMyPost = true;
      this.showSavedPost = false;
    } else if (type === 'saved') {
      this.showMyPost = false;
      this.showSavedPost = true;
    }
  }



  getUserPosts(userId: string): Observable<Post[]> {
    return this.posts$.pipe(
      map(posts => posts.filter(post => post.userId === userId))
    );
  }

  getSavedPosts(userId: string): Observable<Post[]> {
    return this.posts$.pipe(
      map(posts => posts.filter(post => post.saved.includes(userId)))
    );
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
}


