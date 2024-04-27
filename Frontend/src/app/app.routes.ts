import { Routes } from '@angular/router';
import { RegisterComponent } from './modules/user/register/register.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './modules/user/login/login.component';
import { VerifyComponent } from './modules/user/verify/verify.component';
import { ProfileComponent } from './modules/user/profile/profile.component';
import { EditProfileComponent } from './modules/user/edit-profile/edit-profile.component';

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
    path:'home',
    component:HomeComponent
  },
  {
    path:'verify',
    component:VerifyComponent
  }, 
  {
    path:'profile',
    component:ProfileComponent
  },
  {
    path:'editProfile',
    component:EditProfileComponent
  }
];
