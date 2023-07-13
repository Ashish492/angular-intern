import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Admin } from '../model/admin';
import { env } from 'src/app/environments/environment';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient, private router: Router) {}
  login(admin: Admin) {
    return this.http.post<{ token: string }>(
      `${env.apiEndpoint}/auth/login`,
      admin
    );
  }
  logOut() {
    this.removeAuthToken();
    this.router.navigateByUrl('/');
  }
  setAuthToken(token: string) {
    localStorage.setItem('token', token);
  }
  private removeAuthToken() {
    localStorage.removeItem('token');
  }
  getAuthToken() {
    return localStorage.getItem('token') ?? '';
  }
  isLogin(): boolean {
    return !!localStorage.getItem('token');
  }
}
