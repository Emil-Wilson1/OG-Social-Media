import { fetchUserAPI } from './../../store/user.action';
import { AuthService } from './../../../services/auth.service';

import { SelectorData } from './../../store/user.selector';
import { Component } from '@angular/core';
import { Store} from '@ngrx/store';
import { Observable } from 'rxjs';
import  { IUser } from '../../models/userModel';
import { AsyncPipe, CommonModule } from '@angular/common';
import { RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule,AsyncPipe,RouterLinkActive],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {
  userId: string | null = localStorage.getItem('userId');
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


