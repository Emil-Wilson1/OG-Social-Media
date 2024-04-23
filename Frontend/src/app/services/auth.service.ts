import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
interface User {
  email: string;
  username: string;
  fullname: string;
  password: string;
}


interface SignupResponse {
  token: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userToken: string | null = null;
  id!: string;
  private apiUrl:string = 'http://localhost:3000';
  constructor(private http:HttpClient) { }

  createUser(user:User ): Observable<SignupResponse>{
    return this.http.post<SignupResponse>(`${this.apiUrl}/signup`, user);
  }
}
