import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
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

  errorHandler(errorMessage: any) {
    console.log(errorMessage);
    return throwError(errorMessage);
  }
}
