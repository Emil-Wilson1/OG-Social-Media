export interface User {
  email: string;
  username: string;
  otp?:number;
  fullname: string;
  password: string;
}

export interface LoginRequest {
  email: string ;
  password: string ;
}

export interface LoginResponse {
  accessToken:string;
  refreshToken:string;
  token:string
  blocked:string;
  passMatch:string;
  emailMatch:string;
  userId:string;
}
export interface SignupResponse {
  message: string;
  erroe:string;
  email:string;
  token:string;
}

export interface ErrorResponse {
  error: string; 
}
export interface verifyRes{
  message:string
}