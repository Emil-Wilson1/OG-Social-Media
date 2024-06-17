import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { io, Socket } from 'socket.io-client';

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

  constructor() {
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
  

}
