
import { Routes } from '@angular/router';
import { RegisterComponent } from './modules/user/register/register.component';
import { LoginComponent } from './modules/user/login/login.component';
import { VerifyComponent } from './modules/user/verify/verify.component';
import { EditProfileComponent } from './modules/user/edit-profile/edit-profile.component';
import { RestComponent } from './modules/user/rest/rest.component';
import { ResetComponent } from './modules/user/reset/reset.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: 'signup',
    component: RegisterComponent,
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'verify',
    component: VerifyComponent,
  },
  {
    path: 'profile',
    loadComponent: () => import('./modules/user/profile/profile.component').then(m => m.ProfileComponent),
    canActivate: [authGuard],
  },
  {
    path: '',
    loadComponent: () => import('./modules/user/home/home.component').then(m => m.HomeComponent),
    canActivate: [authGuard],
  },
  {
    path: 'editProfile',
    component: EditProfileComponent,
    canActivate: [authGuard],
  },
  {
    path: 'reset',
    component: RestComponent,
  },
  {
    path: 'forgot',
    component: ResetComponent,
  },
  {
    path: 'search',
    loadComponent: () => import('./modules/user/search/search.component').then(m => m.SearchComponent),
    canActivate: [authGuard],
  },
  {
    path: 'user',
    loadComponent: () => import('./modules/user/other-profile/other-profile.component').then(m => m.OtherProfileComponent),
  },
  {
    path: 'notifications',
    loadComponent: () => import('./modules/user/notifications/notifications.component').then(m => m.NotificationsComponent),
    canActivate: [authGuard],
  },
  {
    path: 'messages',
    loadComponent: () => import('./modules/user/messages/messages.component').then(m => m.MessagesComponent),
    canActivate: [authGuard],
  },
  {
    path: 'videocall/:roomId/:userId',
    loadComponent: () => import('./modules/user/video-call/video-call.component').then(m => m.VideoCallComponent),
  },

];
