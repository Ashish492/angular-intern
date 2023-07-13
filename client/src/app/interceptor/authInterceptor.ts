import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../module/auth/services/auth.service';
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private _auth: AuthService) {}
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const token = this._auth.getAuthToken();
    // Clone the request and add the Authorization header for requests made from UserService
    const modifiedRequest = request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
    return next.handle(modifiedRequest);
  }
}
