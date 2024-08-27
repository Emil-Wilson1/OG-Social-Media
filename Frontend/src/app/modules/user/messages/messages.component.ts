import { Component } from '@angular/core';
import { SidebarComponent } from "../sidebar/sidebar.component";
import { AsyncPipe, CommonModule } from '@angular/common';
import { MessageService } from '../../../services/message.service';
import { SocketService } from '../../../services/socket.service';
import { filter, map, Observable, Subject, Subscription, take, takeUntil } from 'rxjs';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { IUser } from '../../../models/userModel';
import { userSelectorData } from '../../store/admin/admin.selector';
import { fetchUsersAPI } from '../../store/admin/admin.action';
import { PickerComponent } from '@ctrl/ngx-emoji-mart';
import { Router } from '@angular/router';
import { VideoModalComponent } from "../video-modal/video-modal.component";

@Component({
    selector: 'app-messages',
    standalone: true,
    templateUrl: './messages.component.html',
    styleUrl: './messages.component.css',
    imports: [SidebarComponent, CommonModule, FormsModule, ReactiveFormsModule, AsyncPipe, PickerComponent, VideoModalComponent]
})
export class MessagesComponent {
  isModalOpen = false;
  searchForm: FormGroup;
  users$: Observable<IUser[]>;
  filteredUsers$: Observable<IUser[]>;
  UsersNot$!: Observable<IUser[]>;
  searchTerm: string = '';
  userDetails$:Observable<any>;
  userId: string = localStorage.getItem('userId') || ''; // Replace with dynamic user ID
  receiverId: string = ''; // Replace with dynamic receiver ID
  typing: boolean = false;
  private subscriptions: Subscription[] = [];
  selectedConversation: string | null = null;
  private unsubscribe$: Subject<void> = new Subject<void>();
  messages: any[] = [];
  newMessage: string = '';
  callRequestedUser: { name: string; profile: string } = { name: '', profile: '' };
  profile:string=''
  senderName!: string; // Initialize senderName variable
  senderProfile!: string;
  showingConversationList: boolean = false;
  constructor(
    private fb: FormBuilder, 
    private store: Store<{ allUser: IUser[] }>,
    private socketService: SocketService,
    private messageService: MessageService,
    private router: Router
  ) {
    this.searchForm = this.fb.group({
      searchTerm: ''
    });

    this.users$ = this.store.select(userSelectorData);
    this.userDetails$ = this.users$.pipe(
      map(users => users.find(user => user._id === this.userId)),
      filter(user => !!user), // Ensure we only emit when a user is found
      map(user => ({
        senderName: user?.fullname,
        senderProfile: user?.profilePic
      }))
    );
    this.filteredUsers$ = this.users$.pipe(
      map(users => users.filter(user => user._id !== this.userId))
    );

    this.searchForm.get('searchTerm')?.valueChanges.subscribe(term => {
      this.searchTerm = term;
      this.filterUsers(term);
    });
  }
  activeConversations: { receiverName: string, receiverId: string,profileImg:string }[] = [];

  ngOnInit(): void {
    this.socketService.listenForVideoCallRequests().subscribe((data: any) => {
      console.log('Video call response received:', data);
      this.setVideoCallJoinRoomId(data.roomId);
      this.callRequestedUser = {
        name: data.senderName,
        profile: data.senderProfile,
      };
      this.setJoinVideoCall(true);
    })
    this.store.dispatch(fetchUsersAPI());
    this.socketService.addUser(this.userId);
    this.loadActiveConversations(); // Load active conversations on init
    this.subscriptions.push(
      this.socketService.listenForMessages().subscribe((message) => {
       // Ensure incoming messages are properly mapped
      const mappedMessage = {
        ...message,
        sender: message.senderId
      };
      this.messages.push(mappedMessage);
      
      // Optionally, sort the messages array if needed
      this.messages.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
      }),
      this.socketService.listenForUsers().subscribe(users => {
        console.log('Users:', users);
      }),
      this.socketService.listenForTyping().subscribe((data) => {
        if (data.senderId === this.receiverId) {
          this.typing = true;
        }
      }),
      this.socketService.listenForStopTyping().subscribe((data) => {
        if (data.senderId === this.receiverId) {
          this.typing = false;
        }
      }),
      this.socketService.listenForVideoCallRequests().subscribe(
        (data: any) => {
          console.log('Video call response received:', data);
          this.setVideoCallJoinRoomId(data.roomId);
          this.callRequestedUser = {
            name: data.senderName,
            profile: data.senderProfile,
          };
          this.setJoinVideoCall(true);
        },
        (error) => {
          console.error('Error in video call subscription:', error);
        }
      )
      
    );
    this.UsersNot$ = this.users$.pipe(
      map(users =>
        users.filter(user =>
          !this.activeConversations.some(conv => conv.receiverId === user._id)
          && user._id !== this.userId 
        )
      )
    );

    this.filterUsers('') 
  }


  dropdownVisible: { [key: number]: boolean } = {};


  toggleDropdown(messageId: number) {
    this.dropdownVisible[messageId] = !this.dropdownVisible[messageId];
  }


  deleteMessage(messageId: any) {
    this.messageService.deleteMessage(messageId).subscribe({
      next: (response) => {
        console.log('Message deleted successfully:', response);
        this.messages = this.messages.filter(message => message._id !== messageId);
        this.toggleDropdown(messageId);
      },
      error: (error) => {
        console.error('Error deleting message:', error);
      },
      complete: () => {
        console.log('Delete request completed');
      }
    });
  }
  
  loadActiveConversations(): void {
    this.messageService.getActiveConversations().subscribe(
      (activeConversations) => {
        // Filter out conversations where the receiver is the current user
        this.activeConversations = activeConversations.filter(
          conversation => conversation.receiverId !== this.userId
        );
  
        if (this.activeConversations.length > 0) {
          this.selectConversation(
            this.activeConversations[0].receiverName,
            this.activeConversations[0].receiverId,
            this.activeConversations[0].profileImg
          );
        }
      },
      (error) => {
        console.error('Error loading active conversations', error);
      }
    );
  }
  
  saveActiveConversations(receiverName: string, receiverId: string, profileImg: string): void {
    const newConversation = { receiverName, receiverId, profileImg };
    this.messageService.saveActiveConversation(newConversation).subscribe(
      (response) => {
        console.log('Active conversation saved', response);
        this.loadActiveConversations();
      },
      (error) => {
        console.error('Error saving active conversation', error);
      }
    );
  }

  startChat(user: IUser) {
    console.log(`Starting chat with ${user.fullname}`);
    this.receiverId = user._id;
    this.selectConversation(user.fullname, user._id,user.profilePic); // Make sure the IUser interface has an 'id' field
    this.closeModal();
    this.saveActiveConversations(user.fullname, user._id,user.profilePic);
    this.loadActiveConversations();
  }

  selectConversation(receiverName: string, receiverId: string,profileImg:string): void {
    this.selectedConversation = receiverName;
    this.profile=profileImg
    this.receiverId = receiverId;
    this.hideConversationList();
    this.clearMessages(); 
    this.loadMessages();
  }

  clearMessages(): void {
    this.messages = [];
  }

  showEmojiPicker = false;


  toggleEmojiPicker() {
    this.showEmojiPicker = !this.showEmojiPicker;
  }

  addEmoji(event: any) {
    const text = `${this.newMessage}${event.emoji.native}`;
    this.newMessage = text;
  }


  getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(this.showPosition.bind(this), this.showError.bind(this));
    } else {
      alert('Geolocation is not supported by this browser.');
    }
  }
  showPosition(position: any) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    const googleMapsUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;
    this.newMessage = `${googleMapsUrl}`;
  }

  showError(error:any) {
    switch (error.code) {
      case error.PERMISSION_DENIED:
        console.error('User denied the request for Geolocation.');
        break;
      case error.POSITION_UNAVAILABLE:
        console.error('Location information is unavailable.');
        break;
      case error.TIMEOUT:
        console.error('The request to get user location timed out.');
        break;
      case error.UNKNOWN_ERROR:
        console.error('An unknown error occurred.');
        break;
    }
  }
  filterUsers(searchTerm: string) {
   this.filteredUsers$ =  this.UsersNot$.pipe(
      map(users =>
        users.filter(user =>
          user.fullname.toLowerCase().includes(searchTerm.toLowerCase())
        )
      )
    );
  }

  openModal() {
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }


 
  loadMessages(): void {
    if (this.receiverId) {
      this.messageService.getMessages(this.userId, this.receiverId)
        .pipe(
          take(1),
          takeUntil(this.unsubscribe$)
        )
        .subscribe({
          next: (response: any) => {
            this.messages = [...response.sentMessages, ...response.receivedMessages];
            console.log([...response.sentMessages], "Check it");
            // Sort messages by timestamp
            this.messages.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
            this.messages.forEach(message => {
              if (message.replyTo) {
                message.replyToMessageId = this.messages.find(m => m._id === message.replyTo);
              }
            });
          },
          error: (error: any) => {
            console.error('Error fetching messages:', error);
          },
          complete: () => {
            console.log('Message loading complete');
          }
        });
    }
  }

  onTyping() {
    this.socketService.sendTyping({ senderId: this.userId, receiverId: this.receiverId });
  }

  onStopTyping() {
    this.socketService.sendStopTyping({ senderId: this.userId, receiverId: this.receiverId });
  }
  replyingToMessageId: string | null = null;

  startReply(messageId: string) {
    this.replyingToMessageId = messageId;
  }

  cancelReply() {
    this.replyingToMessageId = null;
  }
  getMessageById(id: string) {
    return this.messages.find(message => message._id === id) || { text: '' };
  }
  sendMessage(): void {
    if (this.selectedConversation && this.receiverId) {
      let messageText = this.newMessage;
      let messageType = 'text';
  
      // Check if the message is a location
      if (this.newMessage.startsWith('https://www.google.com/maps')) {
        messageType = 'location';
        // The URL is already in the correct format, so we don't need to modify it
      }
  
      const message = {
        senderId: this.userId,
        receiverId: this.receiverId,
        text: messageText,
        timestamp: Date.now(),
        messageType: messageType,
        replyTo: this.replyingToMessageId,
      };
      
      // Add the new message to the messages array
      this.messages.push({
        ...message,
        sender: message.senderId
      });  
  
      this.socketService.sendMessage(message);
      this.newMessage = '';
      this.replyingToMessageId = null;
      this.loadMessages();
    }
  }

  
  handleTyping(): void {
    if (this.selectedConversation && this.receiverId) {
      this.socketService.sendTyping({ senderId: this.userId, receiverId: this.receiverId });
    }
  }

  handleStopTyping(): void {
    if (this.selectedConversation && this.receiverId) {
      this.socketService.sendStopTyping({ senderId: this.userId, receiverId: this.receiverId });
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
  
  randomID(length: number): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let result = '';
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }
  
  startVideoCall() {
 if (this.receiverId) {
    const roomId = this.randomID(10);
    
    // Subscribe to userDetails$ to get the latest sender details
    this.userDetails$.pipe(
      take(1) // Take only the first emission and then complete
    ).subscribe(userDetails => {
      const emitData = {
        senderId: this.userId,
        senderName: userDetails.senderName,
        senderProfile: userDetails.senderProfile,
        receiverId: this.receiverId,
        roomId: roomId,
      };
      
      this.socketService.initiateVideoCall(emitData);
      this.router.navigate([`/videocall/${roomId}/${this.userId}`]);
    });
  }
  }

  joinVideoCall: boolean = false;
  videoCallJoinRoomId: string = '';
  setVideoCallJoinRoomId(roomId: string): void {
    this.videoCallJoinRoomId = roomId;
  }

  setJoinVideoCall(join: boolean): void {
    this.joinVideoCall = join;
  }

  handleJoinVideoCallRoom(): void {
    this.router.navigate([`/videocall/${this.videoCallJoinRoomId}/${this.userId}`]);
  }

  handleRejectVideoCall(): void {
    // Handle rejection logic here
    this.joinVideoCall = false; // Close the modal or reset the joinVideoCall state as needed
  }

  showConversationList() {
    this.showingConversationList = true;
  }

  hideConversationList() {
    this.showingConversationList = false;
  }
}