import { SearchComponent } from './modules/user/search/search.component';
import { Routes } from '@angular/router';
import { RegisterComponent } from './modules/user/register/register.component';
import { LoginComponent } from './modules/user/login/login.component';
import { VerifyComponent } from './modules/user/verify/verify.component';
//import { ProfileComponent } from './modules/user/profile/profile.component';
import { EditProfileComponent } from './modules/user/edit-profile/edit-profile.component';
import { RestComponent } from './modules/user/rest/rest.component';
import { ResetComponent } from './modules/user/reset/reset.component';
import { authGuard } from './guards/auth.guard';
import { OtherProfileComponent } from './modules/user/other-profile/other-profile.component';
import { NotificationsComponent } from './modules/user/notifications/notifications.component';
import { MessagesComponent } from './modules/user/messages/messages.component';
import { VideoCallComponent } from './modules/user/video-call/video-call.component';
//import  HomeComponent  from './modules/user/home/home.component';
export const routes: Routes = [
  {
    path:'signup',
    component:RegisterComponent
  },
  {
    path:'login',
    component:LoginComponent
  }, 
  {
    path:'verify',
    component:VerifyComponent
  }, 
  {
    path: 'profile',
    loadComponent: () => import('./modules/user/profile/profile.component').then(m => m.ProfileComponent),
    canActivate: [authGuard],
  },
  {
    path:'',
    loadComponent: () => import('./modules/user/home/home.component').then(m => m.HomeComponent),
    canActivate: [authGuard]
  },
  {
    path:'editProfile',
    component:EditProfileComponent,
    canActivate: [authGuard]
  },
  {
    path:'reset',
    component:RestComponent
  },
  {
    path:'forgot',
    component:ResetComponent
  },
  {
    path:'search',
    component:SearchComponent,
    canActivate: [authGuard],
  },
  {
    path:'user',
    component:OtherProfileComponent
  },
  {
    path:'notifications',
    component:NotificationsComponent
  },  
  {
    path:'messages',
    component:MessagesComponent
  },
  {
    path: 'videocall/:roomId/:userId',
    component: VideoCallComponent
  },




];
