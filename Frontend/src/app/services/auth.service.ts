import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, Observable, throwError } from 'rxjs';
import { IUser } from '../models/userModel';
import { environment } from '../../environments/environment';
import { LoginRequest, LoginResponse, User, verifyRes } from '../models/interface';
import { io, Socket } from 'socket.io-client';

export interface Notification {
  userId: string;
  receiverId:string;
  type: "like" | "comment" | "mention" | "birthday";
  sourceId: {
    _id: string;
    fullname: string;
  }; 
  message?: string; // Ensure message is defined as string or remove the "?" if it's always present
  createdAt: Date;
  read: boolean;
}



export interface FollowUserRequest {
  followerId: string;
}

export interface FollowUserResponse {
  success: boolean;
  message: string;
}

export interface UnfollowUserResponse {
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userToken: string | null = null;
  id!: string;
  userId=localStorage.getItem('userId')
  private apiUrl: string = environment.apiUrl;
  private Url:string = environment.Url;
  constructor(private http:HttpClient) { 

  }

  get isLoggedIn() {
    if(localStorage.getItem('userToken')){
      return true;
  }else{
    return false
  }
 }
 private userIdSource = new BehaviorSubject<string>('');
 currentUserId = this.userIdSource.asObservable();

 getNotifications(): Observable<{ notifications: Notification[] }> {
  return this.http.get<{ notifications: Notification[] }>(`${this.apiUrl}/notifications/${this.userId}`);
}

 changeUserId(userId: string) {
   this.userIdSource.next(userId);
 }
 
  // createUser(user:User ): Observable<SignupResponse>{
  //   return this.http.post<SignupResponse>(`${this.apiUrl}/signup`, user);
  // }

  signup(user:User): Observable<any> {
    const body = user;
    return this.http.post(`${this.apiUrl}/signup`, body);
  }


  getUser(userData: LoginRequest ): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, userData);
  }

  verifyOTP(email: string, enteredOTP: number): Observable<verifyRes> {
    const verifyUser = { email, enteredOTP };
    return this.http.post<verifyRes>(`${this.apiUrl}/verify`, verifyUser);
  }

  resendOtp(email: string): Observable<verifyRes> {
    const otpResend= { email};
    return this.http.post<verifyRes>(`${this.apiUrl}/resend`, otpResend);
  }

  fetchUserById(userId: string): Observable<IUser[]> {
    const url = `${this.apiUrl}/profile?id=${userId}`; // Update with your endpoint
    return this.http.get<IUser[]>(url)
  }



  editProfile(userId: string, formData: FormData) {
    return this.http.put(`${this.apiUrl}/editProfile?id=${userId}`, formData);
  }
  forgotPassword(email: string): Observable<any> {
  return this.http.post(`${this.apiUrl}/reset`, {email});
  }
  

  resetPassword(token: string, newPassword: string): Observable<any> {
    const url = `${this.apiUrl}/forgot?token=${token}`;
    return this.http.post<any>(url, { newPassword });
  }

  refreshAccessToken(refreshToken: string): Observable<{ newToken: string }> {
    const headers = new HttpHeaders({
      'X-Refresh-Token': refreshToken
    });

    return this.http.post<{ newToken: string }>(`${this.apiUrl}/refresh-token`, null, { headers })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          console.error('Error refreshing access token:', error);
          return throwError(error);
        })
      );
  }
  

  followUser(userId: string, followerId: string): Observable<FollowUserResponse> {
    const url = `${this.apiUrl}/follow/${userId}`;
    const body: FollowUserRequest = { followerId };
    return this.http.post<FollowUserResponse>(url, body)
  }

  unfollowUser(userId: string, followerId: string): Observable<UnfollowUserResponse> {
    const url = `${this.apiUrl}/unfollow/${userId}`;
    const body: FollowUserRequest = { followerId };
    return this.http.post<UnfollowUserResponse>(url, body)
  }

  sendFollowRequest(followerId: string, userId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/${userId}/follow-requests`, { followerId });
  }
  togglePrivacy(userId: string): Observable<any> {
    const url = `${this.apiUrl}/${userId}/togglePrivacy`;
    return this.http.put(url, {});
  }





}
