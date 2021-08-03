import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { VocabularyService } from 'src/app/services/vocabulary.service';
import * as VocabularyActions from '../state/vocabulary.actions';

@Injectable()
export class VocabularyEffects {
    constructor(private actions$: Actions, private vocabularyService: VocabularyService) { }

    loadVocabulary$ = createEffect(() => {
        return this.actions$
            .pipe(
                ofType(VocabularyActions.loadVocabulary),
                mergeMap(action => this.vocabularyService.getLessonVocabulary(action.lessonID.toString())
                    .pipe(
                        map(vocabulary => VocabularyActions.loadVocabularySuccess({ vocabulary })),
                        catchError(error => of(VocabularyActions.loadVocabularyFailure({ error })))
                    ))
            );
    });
}
