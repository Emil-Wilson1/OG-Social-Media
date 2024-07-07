import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { Post } from '../models/postModel';
import { environment } from '../../environments/environment';


interface ReportData {
  reporterId: string;
  reporterUsername: string;
  reportType: string;
  targetId: string;
  details?: string;
}


@Injectable({
  providedIn: 'root'
})
export class PostService {
  private apiUrl:string = environment.apiUrl;
  constructor(private http:HttpClient) { }


  uploadPost(userId:string,formData: FormData) {
    return this.http.post(`${this.apiUrl}/posts?id=${userId}`, formData);
  }

  fetchAllPosts(): Observable<Post[]> {
    return this.http.get<Post[]>(`${this.apiUrl}/fetchPosts`)
  }

  likePost(postId: string, userId: string): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${postId}/like`, { userId });
  }

  unlikePost(postId: string, userId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${postId}/unlike`, { body: { userId } });
  }

  savePost(postId: string, userId: string): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${postId}/save`,{ userId } );
  }
  
  unsavePost(postId: string, userId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${postId}/unsave`, { body:{ userId } });
  }

  reportPost(reportData: ReportData): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/report`, reportData);
  }

  deletePost(postId: string): Observable<void> {
    const url = `${this.apiUrl}/postDeleted/${postId}`;
    return this.http.delete<void>(url);
  }

  updatePostDescription(postId: string, newDescription: string): Observable<any> {
    const url = `${this.apiUrl}/updatePostDescription`;
    const body = { postId, newDescription };
    return this.http.put<any>(url, body);
  }
  
fetchReportedUsers(): Observable<any> {
  return this.http.get<any>(`${this.apiUrl}/reportedUsers`);
}

}
