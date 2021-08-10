import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { mergeMap, map, catchError, switchMap } from 'rxjs/operators';
import { VocabularyService } from 'src/app/services/vocabulary.service';
import * as QuizActions from '../state/quiz.actions';

@Injectable()
export class QuizEffects {
    constructor(private actions$: Actions, private vocabularyService: VocabularyService) { }

    loadQuiz$ = createEffect(() => {
        return this.actions$
            .pipe(
                ofType(QuizActions.loadQuiz),
                mergeMap(action => this.vocabularyService.getDueLessonVocabulary(action.lessonID)
                    .pipe(
                        map(vocabulary => QuizActions.loadQuizSuccess({ vocabulary })),
                        catchError(error => of(QuizActions.loadQuizFailure({ error })))
                    )
                )
            );
    });

    next$ = createEffect(() => {
        return this.actions$
            .pipe(
                ofType(QuizActions.next),
                mergeMap(action => (action.responseState === 'success' ?
                    this.vocabularyService.vocabularyKnown(action.vocabularyID) :
                    this.vocabularyService.vocabularyUnknown(action.vocabularyID)
                )
                    .pipe(
                        map(() => QuizActions.nextSuccess()),
                        catchError(error => of(QuizActions.nextFailure({ error })))
                    )
                )
            );
    });
}
