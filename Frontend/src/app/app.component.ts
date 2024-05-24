import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { MyPostsComponent } from "./modules/user/my-posts/my-posts.component";
import { SidebarComponent } from "./modules/user/sidebar/sidebar.component";


@Component({
    selector: 'app-root',
    standalone: true,
    templateUrl: './app.component.html',
    styleUrl: './app.component.css',
    imports: [RouterOutlet, CommonModule, FormsModule, MyPostsComponent, SidebarComponent]
})
export class AppComponent {
  title = 'Frontend';

}
