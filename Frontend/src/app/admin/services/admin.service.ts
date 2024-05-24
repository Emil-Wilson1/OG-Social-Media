
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {  Observable} from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { LoginRequest, LoginResponse } from '../../models/interface';
import { IUser } from '../../models/userModel';


@Injectable({
  providedIn: 'root'
})
export class AdminService {

  private Url:string = environment.Url;
  constructor(private http:HttpClient) { }


  get isLoggedIn() {
    if(localStorage.getItem('adminToken')){
      return true;
  }else{
    return false
  }
 }

  getadmin(userData: LoginRequest ): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.Url}/login`, userData);
  }

  blockUser(userId: string): Observable<any> {
    return this.http.put<any>(`${this.Url}/block?id=${userId}`,userId);
}

unblockUser(userId: string): Observable<any> {
  return this.http.put<any>(`${this.Url}/unblock?id=${userId}`,userId);
}

fetchAllUsers(): Observable<IUser[]> {
  return this.http.get<IUser[]>(`${this.Url}/fetchUsers`)
}

blockPost(postId: string, reportId: string): Observable<any> {
  return this.http.post<any>(`${this.Url}/blockPost/${postId}/${reportId}`, {});
}

unblockPost(postId: string, reportId: string): Observable<any> {
  return this.http.post<any>(`${this.Url}/unblockPost/${postId}/${reportId}`, {});
}
}