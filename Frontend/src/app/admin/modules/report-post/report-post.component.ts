import { ChangeDetectorRef, Component } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { Observable, Subscription } from 'rxjs';
import { IUser } from '../../../models/userModel';
import { select, Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { fetchUsersAPI } from '../../../modules/store/admin/admin.action';
import { userSelectorData } from '../../../modules/store/admin/admin.selector';
import { CommonModule, DatePipe } from '@angular/common';
import { PostService } from '../../../services/post.service';
import { Post } from '../../../models/postModel';
import { fetchPostAPI } from '../../../modules/store/posts/post.action';
import { SelectorPostData } from '../../../modules/store/posts/post.selector';
import { AdminService } from '../../services/admin.service';
import { NgxPaginationModule } from 'ngx-pagination';

@Component({
  selector: 'app-report-post',
  standalone: true,
  imports: [CommonModule,DatePipe,NgxPaginationModule],
  templateUrl: './report-post.component.html',
  styleUrl: './report-post.component.css'
})
export class ReportPostComponent {
  reportedUsers: any[] = []; 
  posts$!: Observable<Post[]>;
  page: number = 1;
  private fetchReportedUsersSubscription!: Subscription;
  private fetchPostDetailsSubscription!: Subscription;
  private blockPostSubscription!: Subscription;
  private unblockPostSubscription!: Subscription;

  constructor(private reportService: PostService, private route:Router,  
    private adminService: AdminService,private store: Store<{ posts: Post[] }>,
    private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.store.dispatch(fetchPostAPI());
    this.posts$ = this.store.pipe(select(SelectorPostData));
    this.fetchReportedUsers();
  }


  fetchReportedUsers(): void {
    this.fetchReportedUsersSubscription = this.reportService.fetchReportedUsers()
      .subscribe({
        next: (response) => {
          this.reportedUsers = response.users;
          console.log('Reported Users:', this.reportedUsers);
          this.fetchPostDetails();
        },
        error: (error) => {
          console.error('Error fetching reported users:', error);
        }
      });
  }

  fetchPostDetails(): void {
    this.fetchPostDetailsSubscription = this.posts$.subscribe({
      next: (posts) => {
        this.reportedUsers.forEach((user) => {
          const post = posts.find((p) => p._id === user.targetId);
          if (post) {
            user.post = post;
          }
        });
      },
      error: (error) => {
        console.error('Error fetching posts:', error);
      }
    });
  }

  blockPost(postId: string, reportId: string): void {
    this.blockPostSubscription = this.adminService.blockPost(postId, reportId)
      .subscribe({
        next: (response) => {
          const user = this.reportedUsers.find(u => u._id === reportId);
          if (user) {
            user.actionTaken = true;
            this.cdr.detectChanges();  // Ensure the view updates
          }
          console.log('Post blocked successfully:', response);
        },
        error: (error) => {
          console.error('Error blocking post:', error);
        }
      });
  }

  unblockPost(postId: string, reportId: string): void {
    this.unblockPostSubscription = this.adminService.unblockPost(postId, reportId)
      .subscribe({
        next: (response) => {
          const user = this.reportedUsers.find(u => u._id === reportId);
          if (user) {
            user.actionTaken = false;
            this.cdr.detectChanges(); 
          }
          console.log('Post unblocked successfully:', response);
        },
        error: (error) => {
          console.error('Error unblocking post:', error);
        }
      });
  }
  logout(){
    localStorage.removeItem('adminToken')
    this.route.navigate(['/adminLogin'])
  }

  ngOnDestroy(): void {
    if (this.fetchReportedUsersSubscription) {
      this.fetchReportedUsersSubscription.unsubscribe();
    }
    if (this.fetchPostDetailsSubscription) {
      this.fetchPostDetailsSubscription.unsubscribe();
    }
    if (this.blockPostSubscription) {
      this.blockPostSubscription.unsubscribe();
    }
    if (this.unblockPostSubscription) {
      this.unblockPostSubscription.unsubscribe();
    }
  }
}
