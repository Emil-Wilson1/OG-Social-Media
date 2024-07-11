import {  ChangeDetectorRef, Component, ElementRef, HostListener } from '@angular/core';
import { SuggestionsComponent } from "../suggestions/suggestions.component";
import { SidebarComponent } from "../sidebar/sidebar.component";
import { CommonModule } from '@angular/common';
import { SocketService } from '../../../services/socket.service';
import { AuthService } from '../../../services/auth.service';
// notification.model.ts
export interface Notification {
  userId: string;
  receiverId:string;
  type: "like" | "comment" | "mention" | "birthday" | "follow";
  sourceId: {
    _id: string;
    fullname: string;
  }; 
  message?: string; // Ensure message is defined as string or remove the "?" if it's always present
  createdAt: Date;
  read: boolean;
}

@Component({
    selector: 'app-notifications',
    standalone: true,
    templateUrl: './notifications.component.html',
    styleUrl: './notifications.component.css',
    imports: [SuggestionsComponent, SidebarComponent,CommonModule]
})
export class NotificationsComponent {
 
  notifications: Notification[] = [];
  birthdayNotificationCount: number = 0;

  constructor(
    private socketService: SocketService,
    private notificationService: AuthService,
    private cdr: ChangeDetectorRef,
    private elementRef:ElementRef
  ) {}

  ngOnInit(): void {
    // Listen for notifications from Socket.IO
    this.socketService.listenForNotifications().subscribe((data: any) => {
      console.log('Received notification:', data);
        this.notifications.unshift(data);
        console.log('New follow notification:', data);
        this.updateNotificationCount();
        this.cdr.detectChanges(); // Trigger change detection
    });

    // Fetch notifications from backend on initialization
    this.fetchNotifications();
  }
  sidebarOpen: boolean = false;

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }
  
  @HostListener('document:click', ['$event'])
  onClick(event: MouseEvent) {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      // Clicked outside the sidebar; close it if open
      this.sidebarOpen = false;
    }
  }

  fetchNotifications(): void {
    this.notificationService.getNotifications().subscribe((data: { notifications: Notification[] }) => {
      if (data && data.notifications && Array.isArray(data.notifications)) {
        // Ensure to clear existing notifications to avoid duplication
        this.notifications = data.notifications
          .map((notification: Notification) => {
            if (notification.type === 'birthday') {
              notification.message = `It's ${notification.sourceId.fullname}'s birthday tomorrow!`;
            } else if (notification.type === 'follow') {
              notification.message = `${notification.sourceId.fullname} started following you!`;
            }
            return notification;
          })
          .concat(this.notifications); // Add to the beginning
        this.updateNotificationCount();
        this.cdr.detectChanges(); // Trigger change detection
      } else {
        console.error('Fetched data is not in the expected format:', data);
      }
    });
  }

  updateNotificationCount(): void {
    this.birthdayNotificationCount = this.notifications.filter(notification => notification.type === 'birthday').length;
  }

 
}








