import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { io, Socket } from 'socket.io-client';
import { MessageService } from './message.service';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  // private socket: Socket;

  // constructor() {
  //   this.socket = io('http://localhost:3000', {
  //   });
  // }

  // public getBirthdayNotifications(): Observable<any> {
  //   return new Observable(observer => {
  //     this.socket.on('birthdayNotification', (data: any) => {
  //       observer.next(data);
  //     });

  //     // Handle disconnection
  //     return () => {
  //       this.socket.disconnect();
  //     };
  //   });
  // }


  private socket: Socket;

  constructor(private messageService: MessageService) {
    this.socket = io('http://localhost:3000'); // Replace with your backend URL
  }

  listenForNotifications(): Observable<any> {
    return new Observable((observer) => {
      this.socket.on('birthdayNotification', (data) => {
        observer.next(data);
      });

      return () => {
        this.socket.disconnect();
      };
    });
  }


  // Listen for new messages
  listenForMessages(): Observable<any> {
    return new Observable(observer => {
      this.socket.on('getMessage', data => {
        observer.next(data);
      });

      return () => {
        this.socket.disconnect();
      };
    });
  }

  // Send a message
  sendMessage(data: any): void {
    this.messageService.saveMessage(data).subscribe(
      response => {
        this.socket.emit('sendMessage', data);
      },
      error => {
        console.error('Error saving message:', error);
      }
    );
  }

  // Listen for typing indicator
  listenForTyping(): Observable<any> {
    return new Observable(observer => {
      this.socket.on('userTyping', data => {
        observer.next(data);
      });

      return () => {
        this.socket.disconnect();
      };
    });
  }

  // Emit typing indicator
  sendTyping(data: any): void {
    this.socket.emit('typing', data);
  }

  // Emit stop typing indicator
  sendStopTyping(data: any): void {
    this.socket.emit('stopTyping', data);
  }

  // Listen for stop typing indicator
  listenForStopTyping(): Observable<any> {
    return new Observable(observer => {
      this.socket.on('userStopTyping', data => {
        observer.next(data);
      });

      return () => {
        this.socket.disconnect();
      };
    });
  }

  // Add user
  addUser(userId: string): void {
    this.socket.emit('addUser', userId);
  }
 // Emit video call initiation data
 initiateVideoCall(data: any): void {
  this.socket.emit('videoCallRequest', data);
}

// Listen for video call requests
listenForVideoCallRequests(): Observable<any> {
  return new Observable(observer => {
    this.socket.on('videoCallResponse', data => {
      observer.next(data);
    });

    return () => {
      this.socket.disconnect();
    };
  });
}



sendVideoCallResponse(data: any): void {
  this.socket.emit('videoCallResponse', data);
}


listenForUsers(): Observable<any> {
  return new Observable(observer => {
    this.socket.on('getUsers', users => {
      observer.next(users);
    });

    return () => {
      this.socket.disconnect();
    };
  });
}
sendNotification(data: any): void {
  console.log('Sending notification:', data); // Add this line
  this.socket.emit('sendNotification', data);
}

// Listen for follow notifications
listenForFollowNotifications(): Observable<any> {
  return new Observable((observer) => {
    this.socket.on('followNotification', (data) => {
      console.log('Follow notification received:', data); // Add this log
      observer.next(data);
    });

    return () => {
      this.socket.disconnect();
    };
  });
}


}


