import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Post } from '../models/postModel';
import { environment } from '../../environments/environment.development';


interface CommentResponse {
  _id: string;
  userId: string;
  postId: string;
  content: string;
  createdAt?: string;
}
@Injectable({
  providedIn: 'root'
})
export class CommentService {
  private apiUrl:string = environment.apiUrl;
  constructor(private http:HttpClient) { }

  fetchCommentsById(postId: string): Observable<Comment[]> {
    const url = `${this.apiUrl}/comments?id=${postId}`; // Update with your endpoint
    return this.http.get<Comment[]>(url)
  }

  addComment(userId: string, postId: string, content: string): Observable<CommentResponse> {
    return this.http.post<CommentResponse>(`${this.apiUrl}/addComments`, { userId, postId, content });
  }

  getCommentsForPost(postId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${postId}/comments`);
  }

  fetchUserDetailsForComments(comments: any[]): Observable<any[]> {
    return this.http.post<any[]>(`${this.apiUrl}/fetchComments`, { comments });
  }

  deleteComment(commentId: string): Observable<string> {
    const url = `${this.apiUrl}/${commentId}`;
    return this.http.delete(url, { responseType: 'text', observe: 'response' })
      .pipe(
        map((response: HttpResponse<string>) => {
          return response.body as string;
        })
      );
  }

}