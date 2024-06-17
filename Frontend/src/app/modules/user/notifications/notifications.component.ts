import { ChangeDetectorRef, Component } from '@angular/core';
import { SuggestionsComponent } from "../suggestions/suggestions.component";
import { SidebarComponent } from "../sidebar/sidebar.component";
import { CommonModule } from '@angular/common';
import { SocketService } from '../../../services/socket.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../../services/auth.service';
// notification.model.ts
export interface Notification {
  userId: string;
  receiverId: {
    _id: string;
    fullname: string;
  };
  type: "like" | "comment" | "mention" | "birthday";
  sourceId: string;
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
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    // Listen for notifications from Socket.IO
    this.socketService.listenForNotifications().subscribe((data: Notification) => {
        this.notifications.unshift(data);
        this.updateNotificationCount();
        this.cdr.detectChanges(); // Trigger change detection
      
    });

    // Fetch notifications from backend on initialization
    this.fetchNotifications();
  }

  isSidebarClosed = false;

  toggleSidebar() {
    this.isSidebarClosed = !this.isSidebarClosed;
  }

  fetchNotifications(): void {
    this.notificationService.getNotifications().subscribe((data: { notifications: Notification[] }) => {
      if (data && data.notifications && Array.isArray(data.notifications)) {
        // Ensure to clear existing notifications to avoid duplication
        this.notifications = data.notifications
          .filter((notification: Notification) => notification.type === 'birthday')
          .map((notification: Notification) => {
            notification.message = `It's ${notification.receiverId.fullname}'s birthday tomorrow!`; // Use populated fullname
            return notification;
          }).concat(this.notifications); // Add to the beginning
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







