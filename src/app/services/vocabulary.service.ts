import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, retry, throwError } from 'rxjs';
import { Vocabulary } from '../models/vocabulary.model';
import { backend, baseURL } from '../resource.identifiers';

@Injectable({
  providedIn: 'root'
})
export class VocabularyService {
  lessons: Vocabulary[];
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(private http: HttpClient) { }

  createVocabulary(vocabulary: Vocabulary): Observable<Vocabulary> {
    return this.http.post<Vocabulary>(`${baseURL}/${backend.vocabulary}`, JSON.stringify(vocabulary), this.httpOptions)
      .pipe(
        retry(1),
        catchError(this.errorHandler)
      );
  }
  getLessonVocabulary(lessonID: number): Observable<Vocabulary[]>{
    return this.http.get<Vocabulary[]>(`${baseURL}/${backend.lessons}/${lessonID}/${backend.vocabulary}`)
      .pipe(
        retry(1),
        catchError(this.errorHandler)
      );
  }

  getVocabulary(vocabularyID: number): Observable<Vocabulary>{
    return this.http.get<Vocabulary>(`${baseURL}/${backend.vocabulary}/${vocabularyID}`)
      .pipe(
        retry(1),
        catchError(this.errorHandler)
      );
  }

  getDueLessonVocabulary(lessonID: number): Observable<Vocabulary[]> {
    return this.http.get<Vocabulary[]>(`${baseURL}/${backend.lessons}/${lessonID}/${backend.dueLessonVocabulary}`)
      .pipe(
        retry(1),
        catchError(this.errorHandler)
      );
  }

  updateVocabulary(id: number, vocabulary: Vocabulary): Observable<Vocabulary> {
    return this.http.patch<Vocabulary>(`${baseURL}/${backend.vocabulary}/${id}`, JSON.stringify(vocabulary), this.httpOptions)
      .pipe(
        retry(1),
        catchError(this.errorHandler)
      );
  }

  deleteVocabulary(id: number): Observable<void> {
    return this.http.delete<void>(`${baseURL}/${backend.vocabulary}/${id}`)
      .pipe(
        retry(1),
        catchError(this.errorHandler)
      );
  }

  vocabularyKnown(id: number): Observable<void> {
    return this.http.put<void>(`${baseURL}/${backend.vocabulary}/${backend.vocabularyKnown}/${id}`, '')
    .pipe(
      retry(1),
      catchError(this.errorHandler)
    );
  }

  vocabularyUnknown(id: number): Observable<void> {
    return this.http.put<void>(`${baseURL}/${backend.vocabulary}/${backend.vocabularyUnknown}/${id}`, '')
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
