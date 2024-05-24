import { Component } from '@angular/core';
import { SidebarComponent } from "../sidebar/sidebar.component";
import { MyPostsComponent } from "../my-posts/my-posts.component";
import { CommonModule } from '@angular/common';
import { map, Observable } from 'rxjs';
import { select, Store } from '@ngrx/store';
import { IUser } from '../../../models/userModel';
import { Post } from '../../../models/postModel';

import { fetchPostAPI } from '../../store/posts/post.action';
import { SelectorPostData } from '../../store/posts/post.selector';
import { SelectorData } from '../../store/user/user.selector';
import { AuthService } from '../../../services/auth.service';
import { fetchUserAPI } from '../../store/user/user.action';

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
  show:boolean=false
  userId: string = localStorage.getItem('userId') || '';
  user!: string;
  constructor(private store: Store<{ user: IUser[] }>, private stored: Store<{ posts: Post[] }>,private userService:AuthService) {
  }

  ngOnInit(): void {
    this.userService.currentUserId.subscribe(user => {
      this.user = user;
    });
       this.store.dispatch(fetchUserAPI({ id: this.user }));
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
