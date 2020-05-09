import { Injectable } from '@angular/core';
import { Vocabulary } from './vocabulary.service.interface';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class VocabularyService {
  baseURL = environment.backendUrl;
  lessonURI = 'lessons';
  vocabularyURI = 'vocabulary';
  lessons: Vocabulary[];
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(private http: HttpClient) { }

  createVocabulary(vocabulary: Vocabulary): Observable<Vocabulary> {
    // ToDo: use real lesson....
    vocabulary.lesson = 2;
    return this.http.post<Vocabulary>(this.baseURL + this.vocabularyURI, JSON.stringify(vocabulary), this.httpOptions)
      .pipe(
        retry(1),
        catchError(this.errorHandler)
      );
  }
  getLessonVocabulary(lessonID: string): Observable<Vocabulary[]>{
    // console.log('Service url: ', this.baseURL + this.lessonURI + '/' + lessonID + '/' + this.vocabularyURI);
    return this.http.get<Vocabulary[]>(this.baseURL + this.lessonURI + '/' + lessonID + '/' + this.vocabularyURI)
      .pipe(
        retry(1),
        catchError(this.errorHandler)
      );
  }

  getVocabulary(vocabularyID: string): Observable<Vocabulary>{
    return this.http.get<Vocabulary>(this.baseURL + this.vocabularyURI + '/' + vocabularyID)
      .pipe(
        retry(1),
        catchError(this.errorHandler)
      );
  }

  updateVocabulary(id: string, vocabulary: Vocabulary): Observable<Vocabulary> {
    return this.http.patch<Vocabulary>(this.baseURL + this.vocabularyURI + '/' + id, JSON.stringify(vocabulary), this.httpOptions)
      .pipe(
        retry(1),
        catchError(this.errorHandler)
      );
  }

  deleteVocabulary(id: string) {
    return this.http.delete(this.baseURL + this.vocabularyURI + '/' + id)
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
