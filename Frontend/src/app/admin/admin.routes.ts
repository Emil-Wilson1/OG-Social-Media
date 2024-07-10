import { UserManagementComponent } from './modules/user-management/user-management.component';
import { Routes } from '@angular/router';
import { adminLoginComponent } from './modules/login/login.component';
import { ReportPostComponent } from './modules/report-post/report-post.component';
import { adminGuard } from './guards/admin.guard';
import { DashboardComponent } from './modules/dashboard/dashboard.component';

export const adminRoutes: Routes = [
  {
    path:'adminLogin',
    component:adminLoginComponent
  },
  {
    path:'users',
    component:UserManagementComponent,
    canActivate:[adminGuard]
  },
  {
    path:'reportPost',
    component:ReportPostComponent,
    canActivate:[adminGuard]
  },
  {
    path:'dashboard',
    component:DashboardComponent,
    canActivate:[adminGuard]
  },

];
