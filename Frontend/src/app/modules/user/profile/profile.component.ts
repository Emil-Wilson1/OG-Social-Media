import { fetchUserAPI } from '../../store/user/user.action';
import { AuthService } from './../../../services/auth.service';

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
      MyPostsComponent
    ]
})
export class ProfileComponent {
  user$!: Observable<IUser[]>; // Define the observable with User type
  posts$!: Observable<Post[]>;
  show:boolean=false
  userId: string = localStorage.getItem('userId') || '';
  constructor(private store: Store<{ user: IUser[] }>, private stored: Store<{ posts: Post[] }>) {
  }

  ngOnInit(): void {
    this.store.dispatch(fetchUserAPI({ id: this.userId }));
    this.user$ = this.store.select(SelectorData);
    this.stored.dispatch(fetchPostAPI());
    this.posts$ = this.stored.pipe(select(SelectorPostData));
    this.user$.subscribe((data: any) => {
      console.log(data)
    });
  }

open(){
  this.show=true
}


getUserPosts(userId: string): Observable<any> {
  return this.posts$.pipe(
    map(posts => posts.filter(post => post.userId === userId))
  );
}
}


