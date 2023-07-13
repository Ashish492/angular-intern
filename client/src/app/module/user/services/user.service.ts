import { Injectable } from '@angular/core';
import { UserModule } from '../user.module';
import { HttpClient } from '@angular/common/http';
import { User } from '../model/user';
import { env } from 'src/app/environments/environment';
@Injectable({
  providedIn: UserModule,
})
export class UserService {
  constructor(private _http: HttpClient) {}
  addUser(data: Omit<User, 'id'>) {
    return this._http.post<User>(`${env.apiEndpoint}/users`, data);
  }
  deleteUser(id: User['id']) {
    return this._http.delete(`${env.apiEndpoint}/users/${id}`);
  }
  editUser(id: User['id'], data: Partial<User>) {
    return this._http.patch<User>(`${env.apiEndpoint}/users/${id}`, data);
  }
  getUsers() {
    return this._http.get<User[]>(`${env.apiEndpoint}/users`);
  }
}
