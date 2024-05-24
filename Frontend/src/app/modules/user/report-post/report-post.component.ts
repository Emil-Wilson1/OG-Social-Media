import { CommonModule } from '@angular/common';
import { Component, ElementRef, HostListener, Input, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PostService } from '../../../services/post.service';
import { Subscription } from 'rxjs';
export interface Reporter {
  reporterId: string; // Assuming reporterId is a string
  reporterUsername: string;
  reportType: string;
  targetId: string; // Assuming targetId is a string
  details?: string;
  actionTaken?: boolean;
}
@Component({
  selector: 'app-report-post',
  standalone: true,
  imports: [FormsModule,CommonModule],
  templateUrl: './report-post.component.html',
  styleUrl: './report-post.component.css'
})
export class ReportPostComponent {
  @ViewChild('optionsButton', { static: true }) optionsButton!: ElementRef;
  selectedReportOption: string = '';
  showReportModal = false;
  optionsOpen = false;
  showConfirmation = false;
  userId: string = localStorage.getItem('userId') || '';
  @Input() username!: string;
  @Input() target!: string;
  private subscriptions: Subscription = new Subscription();

  constructor(private postService: PostService) {}


  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  toggleOptions() {
    this.optionsOpen = !this.optionsOpen;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (
      this.optionsOpen &&
      !this.optionsButton.nativeElement.contains(event.target)
    ) {
      this.optionsOpen = false;
    }
  }

  submitReport() {
    const reportData: Reporter = {
      reporterId: this.userId,
      reporterUsername: this.username,
      reportType: this.selectedReportOption,
      targetId: this.target,
      details: 'your_details',
    };

    const sub = this.postService.reportPost(reportData).subscribe({
      next: (response) => {
        console.log(response.message);
        this.showReportModal = false;
      },
      error: (error) => {
        console.error('Failed to report post:', error);
      }
    });

    this.subscriptions.add(sub);
  }
}
