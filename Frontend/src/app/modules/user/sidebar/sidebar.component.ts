import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Route, Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {

  constructor(private routes:Router){}
  
 logout(){
  localStorage.removeItem('userToken')
  localStorage.removeItem('refreshToken')
  localStorage.removeItem('userId')
  this.routes.navigate(['/login'])
 }


 @Output() close = new EventEmitter<void>();

 closeSidebar() {
   this.close.emit();
 }
}
