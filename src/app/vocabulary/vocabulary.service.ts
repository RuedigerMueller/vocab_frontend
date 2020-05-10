import { Injectable } from '@angular/core';
import { Vocabulary } from './vocabulary.service.interface';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { backend } from '../resource.identifiers';

@Injectable({
  providedIn: 'root'
})
export class VocabularyService {
  baseURL: string;
  lessons: Vocabulary[];
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(private http: HttpClient) {
    const backendURL: string = environment.backendUrl;
    if ( backendURL.charAt(backendURL.length - 1) === '/') {
      this.baseURL = backendURL.slice(0, -1);
    } else {
      this.baseURL = backendURL;
    }
   }

  createVocabulary(vocabulary: Vocabulary): Observable<Vocabulary> {
    return this.http.post<Vocabulary>(`${this.baseURL}/${backend.vocabulary}`, JSON.stringify(vocabulary), this.httpOptions)
      .pipe(
        retry(1),
        catchError(this.errorHandler)
      );
  }
  getLessonVocabulary(lessonID: string): Observable<Vocabulary[]>{
    return this.http.get<Vocabulary[]>(`${this.baseURL}/${backend.lessons}/${lessonID}/${backend.vocabulary}`)
      .pipe(
        retry(1),
        catchError(this.errorHandler)
      );
  }

  getVocabulary(vocabularyID: string): Observable<Vocabulary>{
    return this.http.get<Vocabulary>(`${this.baseURL}/${backend.vocabulary}/${vocabularyID}`)
      .pipe(
        retry(1),
        catchError(this.errorHandler)
      );
  }

  updateVocabulary(id: string, vocabulary: Vocabulary): Observable<Vocabulary> {
    return this.http.patch<Vocabulary>(`${this.baseURL}/${backend.vocabulary}/${id}`, JSON.stringify(vocabulary), this.httpOptions)
      .pipe(
        retry(1),
        catchError(this.errorHandler)
      );
  }

  deleteVocabulary(id: string) {
    return this.http.delete(`${this.baseURL}/${backend.vocabulary}/${id}`)
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
