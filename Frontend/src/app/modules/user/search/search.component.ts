import { Component } from '@angular/core';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CommonModule } from '@angular/common';
interface User {
  name: string;
  profilePic: string;
}
@Component({
  selector: 'app-search',
  standalone: true,
  imports: [SidebarComponent,CommonModule],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css'
})
export class SearchComponent {
  searchForm: FormGroup;
  users: User[] = [
    { name: 'John Doe', profilePic: 'https://via.placeholder.com/40' },
    { name: 'Jane Smith', profilePic: 'https://via.placeholder.com/40' },
    { name: 'Bob Johnson', profilePic: 'https://via.placeholder.com/40' },
    // Add more users as needed
  ];
  filteredUsers: User[] = this.users;

  constructor(private fb: FormBuilder) {
    this.searchForm = this.fb.group({
      searchTerm: ''
    });

    this.searchForm.get('searchTerm')?.valueChanges.subscribe(searchTerm => {
      this.filterUsers(searchTerm);
    });
  }

  filterUsers(searchTerm: string) {
    this.filteredUsers = this.users.filter(user =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }
}
