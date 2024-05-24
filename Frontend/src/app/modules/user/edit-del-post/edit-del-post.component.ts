import {
  Component,
  ElementRef,
  HostListener,
  Input,
  ViewChild,
} from '@angular/core';
import { PostService } from '../../../services/post.service';
import { Reporter } from '../report-post/report-post.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-edit-del-post',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './edit-del-post.component.html',
  styleUrl: './edit-del-post.component.css',
})
export class EditDelPostComponent {
  @ViewChild('optionsButton', { static: true }) optionsButton!: ElementRef;
  selectedReportOption: string = '';
  showEditModal = false;
  optionsOpen = false;
  showConfirmation = false;
  userId: string = localStorage.getItem('userId') || '';
  @Input() username!: string;
  @Input() post!: string;
  editedDescription = '';
  @Input() des!: string;

  private subscriptions: Subscription[] = [];

  constructor(private postService: PostService) {}

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  toggleOptions(): void {
    this.optionsOpen = !this.optionsOpen;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (
      this.optionsOpen &&
      !this.optionsButton.nativeElement.contains(event.target)
    ) {
      this.optionsOpen = false;
    }
  }

  deletePost(): void {
    this.showConfirmation = true;
    const deleteSubscription = this.postService.deletePost(this.post)
      .subscribe({
        next: () => {
          this.showConfirmation = false;
          location.reload();
          console.log('Post deleted successfully');
        },
        error: (error) => {
          this.showConfirmation = false;
          console.error('Error deleting post:', error);
        }
      });
    this.subscriptions.push(deleteSubscription);
  }

  openEditModal(): void {
    this.showEditModal = true;
  }

  updateDescription(): void {
    const updateSubscription = this.postService.updatePostDescription(this.post, this.des)
      .subscribe({
        next: (response) => {
          console.log('Post description updated successfully:', response);
          location.reload();
          this.showEditModal = false;
          this.des = '';
        },
        error: (error) => {
          console.error('Error updating post description:', error);
        }
      });
    this.subscriptions.push(updateSubscription);
  }
}
