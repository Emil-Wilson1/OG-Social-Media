import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Post } from '../modules/models/postModel';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  private apiUrl:string = 'http://localhost:3000/user';
  constructor(private http:HttpClient) { }


  uploadPost(userId:string,formData: FormData) {
    return this.http.post(`${this.apiUrl}/posts?id=${userId}`, formData);
  }

  fetchAllPosts(): Observable<Post[]> {
    return this.http.get<Post[]>(`${this.apiUrl}/fetchPosts`)
  }

  likePost(postId: string, userId: string): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${postId}/like`, { userId });
  }

  
  unlikePost(postId: string, userId: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${postId}/unlike`, { body:{ userId } });
  }

}
