import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from '../models/user.model';
import { backend, baseURL } from '../resource.identifiers';

@Injectable({
  providedIn: 'root'
})
export class SignupService {
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(private http: HttpClient) { }

  signup(user: User) {
    return this.http.post<User>(`${baseURL}/${backend.signup}`, JSON.stringify(user), this.httpOptions)
      .pipe(map((createdUser: User) => {
        return createdUser;
      }));
  }
}
