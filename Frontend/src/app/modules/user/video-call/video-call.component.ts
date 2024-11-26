
import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { MessageService } from '../../../services/message.service';
import { ActivatedRoute } from '@angular/router';
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';
import { Store } from '@ngrx/store';
import { IUser } from '../../../models/userModel';
import { fetchUsersAPI } from '../../store/admin/admin.action';
import { userSelectorData } from '../../store/admin/admin.selector';
import { environment } from '../../../../environments/environment.development';

@Component({
  selector: 'app-video-call',
  standalone: true,
  imports: [],
  templateUrl: './video-call.component.html',
  styleUrl: './video-call.component.css'
})
export class VideoCallComponent  {
  @ViewChild('videoCallContainer', { static: false }) videoCallContainer!: ElementRef;
  private videoURL:string=environment.videoCall
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

    const appId = 818329338;
    const serverSecret = 'd6126c644551d49685d31fba12276e25';
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
          url: `${this.videoURL}/room/${this.roomId}`,
        },
      ],
    });


  }
  
  
}
