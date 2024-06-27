import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-video-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './video-modal.component.html',
  styleUrl: './video-modal.component.css'
})
export class VideoModalComponent {
  @Input() show: boolean = false;
  @Input() caller: { name: string; profile: string } = { name: '', profile: '' };
  @Output() onHide: EventEmitter<void> = new EventEmitter<void>();
  @Output() onAccept: EventEmitter<void> = new EventEmitter<void>();
  @Output() onReject: EventEmitter<void> = new EventEmitter<void>();

  constructor() {}

  acceptCall(): void {
    this.onAccept.emit();
  }

  rejectCall(): void {
    this.onReject.emit();
  }

  closeModal(): void {
    this.onHide.emit();
  }
}
