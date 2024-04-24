import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SafeResourceUrl } from '@angular/platform-browser';
import { Observable } from 'rxjs';
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
  constructor(private http:HttpClient) { }

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
}