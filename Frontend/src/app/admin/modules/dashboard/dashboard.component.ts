import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { Chart, ChartConfiguration } from 'chart.js/auto';
import { IUser } from '../../../models/userModel';
import { combineLatest, Observable } from 'rxjs';
import { fetchUsersAPI } from '../../../modules/store/admin/admin.action';
import { userSelectorData } from '../../../modules/store/admin/admin.selector';
import { Post } from '../../../models/postModel';
import { fetchPostAPI } from '../../../modules/store/posts/post.action';
import { SelectorPostData } from '../../../modules/store/posts/post.selector';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  @ViewChild('monthlyChart') monthlyChart!: ElementRef;
  users$!: Observable<IUser[]>;
  posts$!: Observable<Post[]>;
  totalUsers: number = 0;
  totalPosts: number = 0;
  // timeSpent: number = 1234;
  // avgTimePerUser: number = 7.2;

  constructor(
    private store: Store<{ allUser: IUser[] }>,
    private stored: Store<{ posts: Post[] }>,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.stored.dispatch(fetchPostAPI());
    this.posts$ = this.stored.select(SelectorPostData);
    this.posts$.subscribe(posts => {
      this.totalPosts = posts.length;
    });
    this.store.dispatch(fetchUsersAPI());
    this.users$ = this.store.select(userSelectorData);
    this.users$.subscribe(users => {
      this.totalUsers = users.length;
    });
    combineLatest([this.posts$, this.users$]).subscribe(([posts, users]) => {
      this.updateChart(posts, users);
    });

  }

  logout(){
    localStorage.removeItem('adminToken')
    this.router.navigate(['/adminLogin'])
  }
  
  private chart: Chart | null = null;

  updateChart(posts: Post[], users: IUser[]): void {
    console.log('Posts:', posts);
    console.log('Users:', users);
    const postsPerMonth = this.processMonthlyData(posts, 'createdAt');
    const usersPerMonth = this.processMonthlyData(users, 'createdAt');
    console.log('Posts per month:', postsPerMonth);
    console.log('Users per month:', usersPerMonth);
    this.createOrUpdateChart(postsPerMonth, usersPerMonth);
  }
  
  createOrUpdateChart(postsPerMonth: number[], usersPerMonth: number[]): void {
    const ctx = this.monthlyChart.nativeElement.getContext('2d');
    
    if (this.chart) {
      // Update existing chart
      this.chart.data.datasets[0].data = postsPerMonth;
      this.chart.data.datasets[1].data = usersPerMonth;
      this.chart.update();
    } else {
      // Create new chart
      const chartConfig: ChartConfiguration = {
        type: 'line',
        data: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
          datasets: [{
            label: 'Posts',
            data: postsPerMonth,
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1
          }, {
            label: 'Users',
            data: usersPerMonth,
            borderColor: 'rgb(255, 99, 132)',
            tension: 0.1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true,
              suggestedMax: Math.max(...postsPerMonth, ...usersPerMonth) + 5
            }
          }
        }
      };
    
      this.chart = new Chart(ctx, chartConfig);
    }
  }

   processMonthlyData(data: any[], createdAtField: string): number[] {
    const monthlyCounts = new Array(12).fill(0);
  
    data.forEach(item => {
      const date = new Date(item[createdAtField]);
      const month = date.getMonth(); // 0-11 for Jan-Dec
      monthlyCounts[month]++;
    });
  
    return monthlyCounts;
  }
}
