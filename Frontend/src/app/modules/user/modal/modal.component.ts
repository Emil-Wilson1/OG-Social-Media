import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommentService } from '../../../services/comment.service';
import moment from 'moment';

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
  @Output() commentsCountUpdated: EventEmitter<number> =
    new EventEmitter<number>();

  constructor(private commentService: CommentService) {}

  ngOnInit() {
    this.fetchComments();
  }

  openModal() {
    this.isOpen = true;
  }

  closeModal() {
    this.isOpen = false;
  }


  deleteComment(commentId: string) {
    this.commentService.deleteComment(commentId).subscribe(
      (message) => {
        console.log(message);
        this.comments = this.comments.filter(
          (comment) => comment._id !== commentId
        );
        console.log(this.comments);
        this.commentsCountUpdated.emit(this.comments.length);
      },
      (error) => {
        console.error('Failed to delete comment:', error);
        // Handle the error
      }
    );
  }
  fetchUserDetailsForComments() {
    if (this.comments.length != 0) {
      this.commentService.fetchUserDetailsForComments(this.comments).subscribe(
        (response) => {
          this.comments = response;
        },
        (error) => {
          console.error('Failed to fetch user details for comments:', error);
        }
      );
    }
  }

  fetchComments() {
    this.commentService.getCommentsForPost(this.postId).subscribe(
      (response) => {
        this.comments = response.comments;
        this.fetchUserDetailsForComments();
        this.commentsCountUpdated.emit(this.comments.length);
      },
      (error) => {
        console.error('Failed to fetch comments:', error);
      }
    );
  }
  addComment() {
    if (!this.newComment) {
      return; // Don't post empty comments
    }

    // Assuming userId is retrieved from authentication or provided from parent component
    const userId = localStorage.getItem('userId') || '';

    this.commentService
      .addComment(userId, this.postId, this.newComment)
      .subscribe(
        (response: any) => {
          // Assuming response type is any
          if (response) {
            console.log('Comment added:', response, response.userId);
            // Fetch user details for the user who posted the new comment
            this.commentService
              .fetchUserDetailsForComments([{ ...response, deleted: false }]) // Pass the new comment in an array
              .subscribe(
                (user: any) => {
                  // Assuming user type is any
                  // Check if user details are available
                  if (user && user.length > 0) {
                    // Update the new comment with user details
                    response.userName = user[0].userName;
                    response.profilePic = user[0].profilePic;
                    // Optionally update the UI with the new comment
                    this.comments.push(response);
                    this.newComment = ''; // Clear the input field
                    this.commentsCountUpdated.emit(this.comments.length);
                  } else {
                    console.error(
                      'Failed to fetch user details for the comment.'
                    );
                  }
                },
                (error) => {
                  console.error('Failed to fetch user details:', error);
                }
              );
          } else {
            console.error('Failed to add comment:');
            // Handle failure, maybe show an error message to the user
          }
        },
        (error) => {
          console.error('Failed to add comment:', error);
          // Handle error, maybe show an error message to the user
        }
      );
  }

  formatCreatedAt(createdAt: string): string {
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
