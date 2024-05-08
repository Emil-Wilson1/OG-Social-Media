import { UserManagementComponent } from './modules/admin/user-management/user-management.component';
import { Routes } from '@angular/router';
import { RegisterComponent } from './modules/user/register/register.component';
import { LoginComponent } from './modules/user/login/login.component';
import { VerifyComponent } from './modules/user/verify/verify.component';
import { ProfileComponent } from './modules/user/profile/profile.component';
import { EditProfileComponent } from './modules/user/edit-profile/edit-profile.component';
import { adminLoginComponent } from './modules/admin/login/login.component';
import { RestComponent } from './modules/user/rest/rest.component';
import { ResetComponent } from './modules/user/reset/reset.component';
import { authGuard } from './guards/auth.guard';
import { HomeComponent } from './modules/user/home/home.component';

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
    path:'profile',
    component:ProfileComponent,
    canActivate: [authGuard],
  },
  {
    path:'editProfile',
    component:EditProfileComponent
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
    path:'adminLogin',
    component:adminLoginComponent
  },
  {
    path:'users',
    component:UserManagementComponent
  },
  {
    path:'home',
    component:HomeComponent
  },

];
