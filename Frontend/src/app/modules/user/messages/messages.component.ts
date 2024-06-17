import { Component } from '@angular/core';
import { SidebarComponent } from "../sidebar/sidebar.component";
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-messages',
    standalone: true,
    templateUrl: './messages.component.html',
    styleUrl: './messages.component.css',
    imports: [SidebarComponent,CommonModule]
})
export class MessagesComponent {
  sidebarOpen: boolean = false;

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }
}
