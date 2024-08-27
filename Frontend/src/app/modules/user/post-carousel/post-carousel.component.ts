import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-post-carousel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './post-carousel.component.html',
  styleUrl: './post-carousel.component.css'
})
export class PostCarouselComponent {
  @Input() images: string[] = [];
  currentIndex: number = 0;

  prevImage() {
    this.currentIndex = (this.currentIndex === 0) ? (this.images.length - 1) : (this.currentIndex - 1);
  }

  nextImage() {
    this.currentIndex = (this.currentIndex === this.images.length - 1) ? 0 : (this.currentIndex + 1);
  }
}
