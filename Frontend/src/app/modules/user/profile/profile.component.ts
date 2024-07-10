import { fetchUserAPI } from '../../store/user/user.action';
import { SelectorData } from '../../store/user/user.selector';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { select, Store} from '@ngrx/store';
import { forkJoin, map, Observable } from 'rxjs';
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
 userPostCount: number = 0;
 followRequestsCount: number = 0;
 followRequestUsers: IUser[] = [];


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
    this.user$.subscribe(users => {
      this.isPrivate = users.some(user => user.isPrivate);
      const currentUser = users.find(user => user._id === this.userId);
      if (currentUser) {
        this.followRequestsCount = currentUser.followRequests.length;
        this.fetchFollowRequestUsers(currentUser.followRequests);
      }
    });  
    this.updateUserPostCount();
  }

  fetchFollowRequestUsers(followRequestIds: string[]): void {
    this.users$.pipe(
      map(users => users.filter(user => followRequestIds.includes(user._id)))
    ).subscribe(filteredUsers => {
      this.followRequestUsers = filteredUsers;
    });
  }

  ignoreRequest(user: string): void {
  this.privacyService.cancelFollowRequest(this.userId, user).subscribe({
      next: () => {
        console.log('Follow request canceled');
        this.store.dispatch(fetchUserAPI({ id: this.userId }));
      },
      error: (error) => {
        console.error('Failed to cancel follow request', error);
      }
    });
  }

  acceptRequest(user: string): void {
    this.privacyService.acceptFollowRequest(this.userId, user).subscribe({
        next: () => {
          console.log('Follow request accepted');
          this.store.dispatch(fetchUserAPI({ id: this.userId }));
        },
        error: (error) => {
          console.error('Failed to accept follow request', error);
        }
      });
    }
  updateUserPostCount(): void {
    this.posts$.subscribe(posts => {
      this.userPostCount = posts.filter(post => post.userId === this.userId).length;
    });
  }
  togglePrivacy(): void {
    this.privacyService.togglePrivacy(this.userId).subscribe({
      next: (response: any) => {
        console.log(response); 
        this.store.dispatch(fetchUserAPI({ id: this.userId }));
      },
      error: (error: any) => {
        console.error(error); // Log any errors
        // Handle errors, e.g., display an error message to the user
      },
      complete: () => {
        // Optional: Handle any logic that needs to occur when the observable completes
      }
    });
  }

 
  showModal = false;




  toggleModal() {
    this.showModal = !this.showModal;
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


