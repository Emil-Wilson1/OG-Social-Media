import { fetchUserAPI } from '../../store/user/user.action';
import { AuthService } from './../../../services/auth.service';

import { SelectorData } from '../../store/user/user.selector';
import { Component } from '@angular/core';
import { Store} from '@ngrx/store';
import { Observable } from 'rxjs';
import  { IUser } from '../../models/userModel';
import { AsyncPipe, CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLinkActive } from '@angular/router';
import { SidebarComponent } from "../sidebar/sidebar.component";

@Component({
    selector: 'app-profile',
    standalone: true,
    templateUrl: './profile.component.html',
    styleUrl: './profile.component.css',
    imports: [CommonModule, AsyncPipe, RouterLinkActive, SidebarComponent]
})
export class ProfileComponent {
  user$!: Observable<IUser[]>; // Define the observable with User type
  constructor(private store: Store<{ user: IUser[] }>) {
  }

  ngOnInit(): void {
    this.store.dispatch(fetchUserAPI());
    this.user$ = this.store.select(SelectorData);
    this.user$.subscribe((data: any) => {
      console.log(data)
    });
  }


}


