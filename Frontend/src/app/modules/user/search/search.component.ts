import { Component } from '@angular/core';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { map, Observable } from 'rxjs';
import { IUser } from '../../../models/userModel';
import { Store } from '@ngrx/store';
import { fetchUserAPI } from '../../store/admin/admin.action';
import { userSelectorData } from '../../store/admin/admin.selector';
interface User {
  name: string;
  profilePic: string;
}
@Component({
  selector: 'app-search',
  standalone: true,
  imports: [SidebarComponent,CommonModule,FormsModule,ReactiveFormsModule],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css'
})
export class SearchComponent {
  searchForm: FormGroup;
  users$: Observable<IUser[]>;
  filteredUsers$: Observable<IUser[]>;
  searchTerm: string = '';

  constructor(private fb: FormBuilder, private store: Store<{ allUser: IUser[] }>) {
    this.searchForm = this.fb.group({
      searchTerm: ''
    });

    this.users$ = this.store.select(userSelectorData);
    this.filteredUsers$ = this.users$;

    this.searchForm.get('searchTerm')?.valueChanges.subscribe(term => {
      this.searchTerm = term;
      this.filterUsers(term);
    });
  }

  ngOnInit(): void {
    this.store.dispatch(fetchUserAPI());
  }

  filterUsers(searchTerm: string) {
    this.filteredUsers$ = this.users$.pipe(
      map(users =>
        users.filter(user =>
          user.username.toLowerCase().includes(searchTerm.toLowerCase())
        )
      )
    );
  }


}
