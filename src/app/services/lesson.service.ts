import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { AuthService } from '../helpers/auth.service';
import { Lesson } from '../models/lesson.model.';
import { backend, baseURL } from '../resource.identifiers';

@Injectable({
  providedIn: 'root'
})
export class LessonService {
  lessons: Lesson[];
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(private http: HttpClient, private authService: AuthService) { }

  createLesson(lesson: Lesson): Observable<Lesson> {
    return this.http.post<Lesson>(`${baseURL}/${backend.lessons}`, JSON.stringify(lesson), this.httpOptions)
      .pipe(
        retry(1),
        catchError(this.errorHandler)
      );
  }

  getLessons(): Observable<Lesson[]> {
    return this.http.get<Lesson[]>(`${baseURL}/${backend.lessons}`, this.httpOptions)
      .pipe(
        retry(1),
        catchError(this.errorHandler)
      );
  }

  getLesson(id: number): Observable<Lesson> {
    return this.http.get<Lesson>(`${baseURL}/${backend.lessons}/${id}`, this.httpOptions)
      .pipe(
        retry(1),
        catchError(this.errorHandler)
      );
  }

  updateLesson(id: number, lesson: Lesson): Observable<Lesson> {
    return this.http.patch<Lesson>(`${baseURL}/${backend.lessons}/${id}`, JSON.stringify(lesson), this.httpOptions)
      .pipe(
        retry(1),
        catchError(this.errorHandler)
      );
  }

  deleteLesson(id: number): Observable<void> {
    return this.http.delete<void>(`${baseURL}/${backend.lessons}/${id}`, this.httpOptions)
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
