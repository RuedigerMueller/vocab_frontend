import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, concatMap, map, mergeMap } from 'rxjs/operators';
import { VocabularyService } from 'src/app/services/vocabulary.service';
import * as VocabularyActions from '../state/vocabulary.actions';

@Injectable()
export class VocabularyEffects {
    constructor(private actions$: Actions, private vocabularyService: VocabularyService) { }

    loadVocabulary$ = createEffect(() => {
        return this.actions$
            .pipe(
                ofType(VocabularyActions.loadVocabulary),
                mergeMap(action => this.vocabularyService.getLessonVocabulary(action.lessonID)
                    .pipe(
                        map(vocabulary => VocabularyActions.loadVocabularySuccess({ vocabulary })),
                        catchError(error => of(VocabularyActions.loadVocabularyFailure({ error })))
                    ))
            );
    });

    updateVocabulary$ = createEffect(() => {
        return this.actions$
            .pipe(
                ofType(VocabularyActions.updateVocabulary),
                concatMap(action =>
                    this.vocabularyService.updateVocabulary(action.vocabularyID, action.vocabulary)
                      .pipe(
                        map(vocabulary => VocabularyActions.updateVocabularySuccess({ vocabulary })),
                        catchError(error => of(VocabularyActions.updateVocabularyFailure({ error })))
                      )
                  )
            );
    });

    deleteVocabulary$ = createEffect(() => {
        return this.actions$
            .pipe(
                ofType(VocabularyActions.deleteVocabulary),
                mergeMap(action =>
                    this.vocabularyService.deleteVocabulary(action.vocabularyID)
                      .pipe(
                        map(() => VocabularyActions.deleteVocabularySuccess({ vocabularyID: action.vocabularyID })),
                        catchError(error => of(VocabularyActions.deleteVocabularyFailure({ error })))
                      )
                  )
            );
    });
}
