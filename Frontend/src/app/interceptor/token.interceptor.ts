import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { BehaviorSubject, catchError, filter, Observable, switchMap, take, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service'; // adjust the path as needed
import { Router } from '@angular/router';
// types/httpStatus.ts
export enum HttpStatusCode {
  OK = 200,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  AUTHENTICATION_FAILED = 401,
  TOKEN_EXPIRED = 401,
  INVALID_TOKEN = 401,
  NO_TOKEN = 401,
  NO_REFRESH_TOKEN = 401,
}


@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  // private isRefreshingToken = false;
  // private tokenSubject: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);

  // constructor(private authService: AuthService, private router: Router) {}

  // intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
  //   const accessToken = localStorage.getItem('userToken');
  //   const refreshToken = localStorage.getItem('refreshToken');

  //   if (accessToken && refreshToken) {
  //     const cloned = req.clone({
  //       setHeaders: {
  //         Authorization: `Bearer ${accessToken}`,
  //         'X-Refresh-Token': refreshToken
  //       }
  //     });

  //     return next.handle(cloned).pipe(
  //       catchError((error) => {
  //         if (error instanceof HttpErrorResponse) {
  //           if (error.status === 401) {
  //             // Unauthorized error, try refreshing the token
  //             return this.handleUnauthorizedError(req, next);
  //           } else if (error.status === 403 && error.error.message === 'User has been blocked') {
  //             // User is blocked, perform logout and redirect to login page
  //             this.logoutAndRedirect();
  //             return throwError(() => new Error('User has been blocked'));
  //           }
  //         }
  //         return throwError(() => error);
  //       })
  //     );
  //   }

  //   return next.handle(req);
  // }

  // private handleUnauthorizedError(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
  //   if (!this.isRefreshingToken) {
  //     this.isRefreshingToken = true;
  //     this.tokenSubject.next(null);

  //     const refreshToken = localStorage.getItem('refreshToken') || '';
  //     console.log(refreshToken);

  //     return this.authService.refreshAccessToken(refreshToken).pipe(
  //       switchMap((response: { newToken: string }) => {
  //         this.isRefreshingToken = false;
  //         this.tokenSubject.next(response.newToken);
  //         localStorage.setItem('userToken', response.newToken);
  //         return next.handle(this.addAuthorizationHeader(req, response.newToken));
  //       }),
  //       catchError((error) => {
  //         this.isRefreshingToken = false;
  //         this.tokenSubject.next(null);
  //         this.router.navigate(['/login']); 
  //         return throwError(() => error);
  //       })
  //     );
  //   }

  //   return this.tokenSubject.pipe(
  //     filter((token): token is string => token !== null),
  //     take(1),
  //     switchMap((token) => {
  //       return next.handle(this.addAuthorizationHeader(req, token));
  //     })
  //   );
  // }

  // private addAuthorizationHeader(req: HttpRequest<any>, token: string): HttpRequest<any> {
  //   const refreshToken = localStorage.getItem('refreshToken') || '';
  //   return req.clone({
  //     setHeaders: {
  //       Authorization: `Bearer ${token}`,
  //       'X-Refresh-Token': refreshToken
  //     }
  //   });
  // }

  // private logoutAndRedirect() {
  //   localStorage.removeItem('userToken');
  //   localStorage.removeItem('refreshToken');
  //   this.router.navigate(['/login']);
  // }

  private isRefreshingToken = false;
  private tokenSubject: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);

  constructor(private authService: AuthService, private router: Router) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const accessToken = localStorage.getItem('userToken');
    const refreshToken = localStorage.getItem('refreshToken');

    if (accessToken && refreshToken) {
      const cloned = req.clone({
        setHeaders: {
          Authorization: `Bearer ${accessToken}`,
          'X-Refresh-Token': refreshToken,
        },
      });

      return next.handle(cloned).pipe(
        catchError((error) => {
          if (error instanceof HttpErrorResponse) {
            if (error.status === HttpStatusCode.UNAUTHORIZED) {
              // Unauthorized error, try refreshing the token
              return this.handleUnauthorizedError(req, next);
            } else if (error.status === HttpStatusCode.FORBIDDEN && error.error.message === 'User has been blocked') {
              // User is blocked, perform logout and redirect to login page
              this.logoutAndRedirect();
              return throwError(() => new Error('User has been blocked'));
            }
          }
          return throwError(() => error);
        }),
      );
    }

    return next.handle(req);
  }

  private handleUnauthorizedError(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!this.isRefreshingToken) {
      this.isRefreshingToken = true;
      this.tokenSubject.next(null);

      const refreshToken = localStorage.getItem('refreshToken') || '';
      console.log(refreshToken);

      return this.authService.refreshAccessToken(refreshToken).pipe(
        switchMap((response: { newToken: string }) => {
          this.isRefreshingToken = false;
          this.tokenSubject.next(response.newToken);
          localStorage.setItem('userToken', response.newToken);
          return next.handle(this.addAuthorizationHeader(req, response.newToken));
        }),
        catchError((error) => {
          this.isRefreshingToken = false;
          this.tokenSubject.next(null);
          this.router.navigate(['/login']);
          return throwError(() => error);
        }),
      );
    }

    return this.tokenSubject.pipe(
      filter((token): token is string => token !== null),
      take(1),
      switchMap((token) => {
        return next.handle(this.addAuthorizationHeader(req, token));
      }),
    );
  }

  private addAuthorizationHeader(req: HttpRequest<any>, token: string): HttpRequest<any> {
    const refreshToken = localStorage.getItem('refreshToken') || '';
    return req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
        'X-Refresh-Token': refreshToken,
      },
    });
  }

  private logoutAndRedirect() {
    localStorage.removeItem('userToken');
    localStorage.removeItem('refreshToken');
    this.router.navigate(['/login']);
  }

}
