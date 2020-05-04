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
  lessonURI = 'lessons/';
  vocabularyURI = 'vocabularies/';
  lessons: Vocabulary[];
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(private http: HttpClient) { }

  getVocabularies(lessonID: string): Observable<Vocabulary[]>{
    return this.http.get<Vocabulary[]>(this.baseURL + this.lessonURI + lessonID + this.vocabularyURI)
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
