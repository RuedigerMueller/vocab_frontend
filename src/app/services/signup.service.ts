import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ValidationErrors } from '@angular/forms';
import { catchError, map, Observable, retry, throwError } from 'rxjs';
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

  signup(user: User): Observable<User> {
    return this.http.post<User>(`${baseURL}/${backend.signup}`, JSON.stringify(user), this.httpOptions)
      .pipe(
        retry(1),
        catchError(this.errorHandler)
      );
  }

  checkEMailTaken(email: string): Observable<ValidationErrors | null> {
    const params = new HttpParams().set('email', email);
    const obs = this.http.get<User>(`${baseURL}/${backend.users}`, { params })
      .pipe(
        map((user) => {
          // null no error, object for error
          return !user ? null : { eMailTaken: true };
        })
      );
    return obs;
  }

  errorHandler(errorMessage: any) {
    console.log(errorMessage);
    return throwError(errorMessage);
  }
}
