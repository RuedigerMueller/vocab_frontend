import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, of } from 'rxjs';
import { VocabularyService } from 'src/app/services/vocabulary.service';
import * as fromActions from '../state/quiz.actions';

@Injectable()
export class QuizEffects {
    constructor(private actions$: Actions, private vocabularyService: VocabularyService) { }

    loadQuiz$ = createEffect(() => {
        return this.actions$
            .pipe(
                ofType(fromActions.loadQuiz),
                mergeMap(action => this.vocabularyService.getDueLessonVocabulary(action.lessonID)
                    .pipe(
                        map(vocabulary => fromActions.loadQuizSuccess({ vocabulary })),
                        catchError(error => of(fromActions.loadQuizFailure({ error })))
                    )
                )
            );
    });

    next$ = createEffect(() => {
        return this.actions$
            .pipe(
                ofType(fromActions.next),
                mergeMap(action => (action.responseState === 'success' ?
                    this.vocabularyService.vocabularyKnown(action.vocabularyID) :
                    this.vocabularyService.vocabularyUnknown(action.vocabularyID)
                )
                    .pipe(
                        map(() => fromActions.nextSuccess()),
                        catchError(error => of(fromActions.nextFailure({ error })))
                    )
                )
            );
    });
}
