import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, Subject } from 'rxjs';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';
import { io, Socket } from 'socket.io-client';
export interface Message {
  type: string;
  data: any;
}

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  private apiUrl:string = environment.apiUrl;
  constructor(private http:HttpClient,private router:Router) { 
    this.connect();
  }

  saveMessage(messageData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/save`, messageData);
  }

  getMessages(userId: string, receiverId: string): Observable<any> {
    console.log(`Fetching messages for user: ${userId} and receiver: ${receiverId}`); // Log for debugging
    return this.http.get(`${this.apiUrl}/messages/${userId}/${receiverId}`);
  }
  private socket!: Socket;

  private messagesSubject = new Subject<Message>();
  public messages$ = this.messagesSubject.asObservable();

  /**
   * Creates a new Socket.io connection and sends messages to the messages subject
   */
  public connect(): void {
    if (!this.socket || !this.socket.connected) {
      this.socket = io('http://localhost:3000');

      this.socket.on('connect', () => {
        console.log('[DataService]: connection ok');
      });

      this.socket.on('disconnect', () => {
        console.log('[DataService]: connection closed');
      });

      this.socket.on('message', (msg: Message) => {
        console.log('Received message of type: ' + msg.type);
        this.messagesSubject.next(msg);
      });
    }
  }

  sendMessage(msg: Message): void {
    console.log('sending message: ' + msg.type);
    this.socket.emit('message', msg);
  }
}