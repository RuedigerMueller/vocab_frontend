import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, concatMap, map, mergeMap } from 'rxjs/operators';
import { VocabularyService } from 'src/app/services/vocabulary.service';
import * as fromActions from '../state/vocabulary.actions';

@Injectable()
export class VocabularyEffects {
    constructor(private actions$: Actions, private vocabularyService: VocabularyService) { }

    loadVocabulary$ = createEffect(() => {
        return this.actions$
            .pipe(
                ofType(fromActions.loadVocabulary),
                mergeMap(action => this.vocabularyService.getLessonVocabulary(action.lessonID)
                    .pipe(
                        map(vocabulary => fromActions.loadVocabularySuccess({ vocabulary })),
                        catchError(error => of(fromActions.loadVocabularyFailure({ error })))
                    ))
            );
    });

    createVocabulary$ = createEffect(() => {
        return this.actions$
            .pipe(
                ofType(fromActions.createVocabulary),
                concatMap(action =>
                    this.vocabularyService.createVocabulary(action.vocabulary)
                        .pipe(
                            map(() => fromActions.createVocabularySuccess({ vocabulary: action.vocabulary })),
                            catchError(error => of(fromActions.createVocabularyFailure({ error })))
                        )
                )
            );
    });

    updateVocabulary$ = createEffect(() => {
        return this.actions$
            .pipe(
                ofType(fromActions.updateVocabulary),
                concatMap(action =>
                    this.vocabularyService.updateVocabulary(action.vocabularyID, action.vocabulary)
                      .pipe(
                        map(() => fromActions.updateVocabularySuccess({
                            vocabularyID: action.vocabularyID,
                            vocabulary: action.vocabulary
                        })),
                        catchError(error => of(fromActions.updateVocabularyFailure({ error })))
                      )
                  )
            );
    });

    deleteVocabulary$ = createEffect(() => {
        return this.actions$
            .pipe(
                ofType(fromActions.deleteVocabulary),
                mergeMap(action =>
                    this.vocabularyService.deleteVocabulary(action.vocabularyID)
                      .pipe(
                        map(() => fromActions.deleteVocabularySuccess({ vocabularyID: action.vocabularyID })),
                        catchError(error => of(fromActions.deleteVocabularyFailure({ error })))
                      )
                  )
            );
    });
}
