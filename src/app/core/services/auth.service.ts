import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Auth } from '../interfaces/auth';
import { environment } from '../../../environments/environment.development';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor() {}
  private readonly httpClient = inject(HttpClient);
  private readonly router = inject(Router);
  userToken: BehaviorSubject<any> = new BehaviorSubject(null);

  setUserToken(): void {
    let token = localStorage.getItem('token');
    if (token !== null) {
      this.userToken.next(token);
    }
  }

  handleRegister(userInfo: Auth): Observable<any> {
    return this.httpClient.post(environment.registerURL , userInfo);
  }

  handleLogin(userInfo: Auth): Observable<any> {
    return this.httpClient.post(environment.loginURL , userInfo).pipe(
      tap((response: any) => {
        // Assuming your backend returns { token: "..." }
        const token = response.token;
        if (token) {
          localStorage.setItem('token', token);
          this.userToken.next(token);
        }
      })
    );
  }

  logout(): void {
    localStorage.removeItem('token');
    this.userToken.next(null);
    this.router.navigate(['/signin']);
  }
}
