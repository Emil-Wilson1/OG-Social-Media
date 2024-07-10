import { Component, ElementRef, HostListener } from '@angular/core';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { map, Observable } from 'rxjs';
import { IUser } from '../../../models/userModel';
import { Store } from '@ngrx/store';
import { fetchUsersAPI } from '../../store/admin/admin.action';
import { userSelectorData } from '../../store/admin/admin.selector';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import { SuggestionsComponent } from "../suggestions/suggestions.component";
interface User {
  name: string;
  profilePic: string;
}
@Component({
    selector: 'app-search',
    standalone: true,
    templateUrl: './search.component.html',
    styleUrl: './search.component.css',
    imports: [SidebarComponent, CommonModule, FormsModule, ReactiveFormsModule, SuggestionsComponent]
})
export class SearchComponent {
  searchForm: FormGroup;
  users$: Observable<IUser[]>;
  userId:string=localStorage.getItem('userId') || ''
  filteredUsers$: Observable<IUser[]>;
  searchTerm: string = '';

  constructor(private fb: FormBuilder, 
    private store: Store<{ allUser: IUser[] }>,
    private userService:AuthService,
    private router:Router,
    private elementRef: ElementRef
  ) {
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
    this.store.dispatch(fetchUsersAPI());
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

  goToUserProfile(userId: string): void {
    if(userId!==this.userId){
    this.userService.changeUserId(userId);
    this.router.navigate(['/user'], { queryParams: { userId: userId } });
    }else{
      this.router.navigate(['/profile']);
    }
  }
  sidebarOpen: boolean = false;

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }

  @HostListener('document:click', ['$event'])
  onClick(event: MouseEvent) {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      // Clicked outside the sidebar; close it if open
      this.sidebarOpen = false;
    }
  }

}
