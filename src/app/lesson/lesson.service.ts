import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Lesson } from './lesson.service.interface';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LessonService {
  // Todo: get this from coniguration
  baseURL = 'http://localhost:3000/';
  lessonURI = 'lessons/';
  lessons: Lesson[];
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(private http: HttpClient) { }

  createLesson(lesson: Lesson): Observable<Lesson> {
    // Todo: add the real user!
    lesson.user = 'UserFrontend';

    return this.http.post<Lesson>(this.baseURL + this.lessonURI, JSON.stringify(lesson), this.httpOptions)
      .pipe(
        retry(1),
        catchError(this.errorHandler)
      );
  }

  getLessons(): Observable<Lesson[]>{
    return this.http.get<Lesson[]>(this.baseURL + this.lessonURI)
      .pipe(
        retry(1),
        catchError(this.errorHandler)
      );
  }

  getLesson(id: string): Observable<Lesson> {
    console.log('Service url: ', this.baseURL + this.lessonURI + id);
    return this.http.get<Lesson>(this.baseURL + this.lessonURI + id)
      .pipe(
        retry(1),
        catchError(this.errorHandler)
      );
  }

  updateLesson(id: string, lesson: Lesson): Observable<Lesson> {
    return this.http.patch<Lesson>(this.baseURL + this.lessonURI + id, JSON.stringify(lesson), this.httpOptions)
      .pipe(
        retry(1),
        catchError(this.errorHandler)
      );
  }

  deleteLesson(id: string) {
    return this.http.delete(this.baseURL + this.lessonURI + id)
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
