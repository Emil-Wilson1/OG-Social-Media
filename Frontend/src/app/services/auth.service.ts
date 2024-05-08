import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SafeResourceUrl } from '@angular/platform-browser';
import { Observable } from 'rxjs';
import { IUser } from '../modules/models/userModel';
interface User {
  email: string;
  username: string;
  otp?:number;
  fullname: string;
  password: string;
}

interface LoginRequest {
  email: string ;
  password: string ;
}

interface LoginResponse {
  token: string;
  passMatch:string;
  emailMatch:string;
  userId:string;
}
interface SignupResponse {
  message: string;
  email:string;
  token:string;
}


interface verifyRes{
  message:string
}


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userToken: string | null = null;
  id!: string;
  private apiUrl:string = 'http://localhost:3000/user';
  private Url:string = 'http://localhost:3000/admin';
  constructor(private http:HttpClient) { }


  get isLoggedIn() {
    if(localStorage.getItem('userToken')){
      return true;
  }else{
    return false
  }
 }

 
  createUser(user:User ): Observable<SignupResponse>{
    return this.http.post<SignupResponse>(`${this.apiUrl}/signup`, user);
  }

  getUser(userData: LoginRequest ): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, userData);
  }

  verifyOTP(email: string, enteredOTP: number): Observable<verifyRes> {
    const verifyUser = { email, enteredOTP };
    return this.http.post<verifyRes>(`${this.apiUrl}/verify`, verifyUser);
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

}
