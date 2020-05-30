import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { backend } from '../resource.identifiers';
import { Lesson } from './lesson.service.interface';

@Injectable({
  providedIn: 'root'
})
export class LessonService {
  baseURL: string;
  lessons: Lesson[];
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };
  bearerString: string;

  constructor(private http: HttpClient) {
    const backendURL: string = environment.backendUrl;
    if (backendURL.charAt(backendURL.length - 1) === '/') {
      this.baseURL = backendURL.slice(0, -1);
    } else {
      this.baseURL = backendURL;
    }

    const accessTokenObj = JSON.parse(localStorage.getItem('userInfo'));
    const accessToken: string = accessTokenObj.access_token;
    const bearerString = `Bearer ${accessToken}`;
    this.httpOptions.headers = this.httpOptions.headers.set('Authorization', bearerString);
  }

  createLesson(lesson: Lesson): Observable<Lesson> {
    // Todo: add the real user!
    lesson.user = 'UserFrontend';

    return this.http.post<Lesson>(`${this.baseURL}/${backend.lessons}`, JSON.stringify(lesson), this.httpOptions)
      .pipe(
        retry(1),
        catchError(this.errorHandler)
      );
  }

  getLessons(): Observable<Lesson[]> {
    return this.http.get<Lesson[]>(`${this.baseURL}/${backend.lessons}`, this.httpOptions)
      .pipe(
        retry(1),
        catchError(this.errorHandler)
      );
  }

  getLesson(id: string): Observable<Lesson> {
    return this.http.get<Lesson>(`${this.baseURL}/${backend.lessons}/${id}`, this.httpOptions)
      .pipe(
        retry(1),
        catchError(this.errorHandler)
      );
  }

  updateLesson(id: string, lesson: Lesson): Observable<Lesson> {
    return this.http.patch<Lesson>(`${this.baseURL}/${backend.lessons}/${id}`, JSON.stringify(lesson), this.httpOptions)
      .pipe(
        retry(1),
        catchError(this.errorHandler)
      );
  }

  deleteLesson(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseURL}/${backend.lessons}/${id}`, this.httpOptions)
      .pipe(
        retry(1),
        catchError(this.errorHandler)
      );
  }

  errorHandler(error: any) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Get client-side error
      errorMessage = error.error.message;
    } else {
      // Get server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.log(errorMessage);
    return throwError(errorMessage);
  }
}
