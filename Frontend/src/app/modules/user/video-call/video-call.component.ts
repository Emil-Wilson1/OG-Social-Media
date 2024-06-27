
import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { MessageService } from '../../../services/message.service';
import { ActivatedRoute } from '@angular/router';
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';
import { Store } from '@ngrx/store';
import { IUser } from '../../../models/userModel';
import { fetchUsersAPI } from '../../store/admin/admin.action';
import { userSelectorData } from '../../store/admin/admin.selector';

@Component({
  selector: 'app-video-call',
  standalone: true,
  imports: [],
  templateUrl: './video-call.component.html',
  styleUrl: './video-call.component.css'
})
export class VideoCallComponent  {
  @ViewChild('videoCallContainer', { static: false }) videoCallContainer!: ElementRef;

  roomId!: string;
  userId!: string;
  user!: string;
  userDetails: any;


  constructor(private route: ActivatedRoute,private store: Store<{ allUser: IUser[] }>) {
    this.route.params.subscribe(params => {
      this.roomId = params['roomId'];
      this.userId = params['userId'];
    });
    this.store.dispatch(fetchUsersAPI());
    this.store.select(userSelectorData).subscribe(users => {
      const currentUser = users.find(user => user._id === this.userId);
      if (currentUser) {
        this.user = currentUser._id;
        this.userDetails = currentUser;
      }
    });
  }

  ngAfterViewInit(): void {
    if (!this.roomId || !this.user) {
      console.error('roomId or user is missing');
      return;
    }

    const appId = 1700648710;
    const serverSecret = '24ba49eb4eaa045342275a0894079d04';
    const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(appId, serverSecret, this.roomId, this.user, this.userDetails?.username);

    const zc = ZegoUIKitPrebuilt.create(kitToken);
    zc.joinRoom({
      container: this.videoCallContainer.nativeElement,
      scenario: {
        mode: ZegoUIKitPrebuilt.OneONoneCall,
      },
      showScreenSharingButton: false,
      sharedLinks: [
        {
          name: 'Copy Link',
          url: `http://localhost:3000/room/${this.roomId}`,
        },
      ],
    });


  }
  
  
}
