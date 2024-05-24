import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommentService } from '../../../services/comment.service';
import moment from 'moment';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.css',
})
export class ModalComponent {
  isOpen = false;
  @Input() postId: string = '';
  newComment: string = '';
  comments: any[] = [];
  @Output() commentsCountUpdated: EventEmitter<number> = new EventEmitter<number>();
  private subscriptions: Subscription = new Subscription();

  constructor(private commentService: CommentService) {}

  ngOnInit() {
    this.fetchComments();
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  openModal() {
    this.isOpen = true;
  }

  closeModal() {
    this.isOpen = false;
  }

  deleteComment(commentId: string) {
    const sub = this.commentService.deleteComment(commentId).subscribe({
      next: (message) => {
        console.log(message);
        this.comments = this.comments.filter(comment => comment._id !== commentId);
        console.log(this.comments);
        this.commentsCountUpdated.emit(this.comments.length);
      },
      error: (error) => {
        console.error('Failed to delete comment:', error);
      }
    });
    this.subscriptions.add(sub);
  }

  fetchUserDetailsForComments() {
    if (this.comments.length !== 0) {
      const sub = this.commentService.fetchUserDetailsForComments(this.comments).subscribe({
        next: (response) => {
          this.comments = response;
        },
        error: (error) => {
          console.error('Failed to fetch user details for comments:', error);
        }
      });
      this.subscriptions.add(sub);
    }
  }

  fetchComments() {
    const sub = this.commentService.getCommentsForPost(this.postId).subscribe({
      next: (response) => {
        this.comments = response.comments;
        this.fetchUserDetailsForComments();
        this.commentsCountUpdated.emit(this.comments.length);
      },
      error: (error) => {
        console.error('Failed to fetch comments:', error);
      }
    });
    this.subscriptions.add(sub);
  }

  addComment() {
    if (!this.newComment) {
      return;
    }

    const userId = localStorage.getItem('userId') || '';

    const sub = this.commentService.addComment(userId, this.postId, this.newComment).subscribe({
      next: (response: any) => {
        if (response) {
          console.log('Comment added:', response, response.userId);

          const userDetailsSub = this.commentService.fetchUserDetailsForComments([{ ...response, deleted: false }]).subscribe({
            next: (user: any) => {
              if (user && user.length > 0) {
                response.userName = user[0].userName;
                response.profilePic = user[0].profilePic;
                this.comments.push(response);
                this.newComment = '';
                this.commentsCountUpdated.emit(this.comments.length);
              } else {
                console.error('Failed to fetch user details for the comment.');
              }
            },
            error: (error) => {
              console.error('Failed to fetch user details:', error);
            }
          });
          this.subscriptions.add(userDetailsSub);
        } else {
          console.error('Failed to add comment:');
        }
      },
      error: (error) => {
        console.error('Failed to add comment:', error);
      }
    });
    this.subscriptions.add(sub);
  }


  formatCreatedAt(createdAt: string): string {
    const createdAtDate = moment(createdAt);

    const now = moment();
    const diffInMinutes = now.diff(createdAtDate, 'minutes');
    const diffInHours = now.diff(createdAtDate, 'hours');
    const diffInDays = now.diff(createdAtDate, 'days');

    if (diffInMinutes == 0) {
      return `Just now`;
    } else if (diffInMinutes < 60) {
      return `${diffInMinutes} minutes ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours} hours ago`;
    } else if (diffInDays < 7) {
      return `${diffInDays} days ago`;
    } else {
      return createdAtDate.format('MMM DD, YYYY'); 
    }
  }
}
