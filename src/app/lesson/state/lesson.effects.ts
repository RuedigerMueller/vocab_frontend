import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { LessonService } from 'src/app/services/lesson.service';
import * as LessonActions from '../state/lesson.actions';

@Injectable()
export class LessonEffects {
    constructor(private actions$: Actions, private lessonService: LessonService) { }

    loadLessons$ = createEffect(() => {
        return this.actions$
            .pipe(
                ofType(LessonActions.loadLessons),
                mergeMap(() => this.lessonService.getLessons()
                    .pipe(
                        map(lessons => LessonActions.loadLessonSuccess( { lessons })),
                        catchError(error => of(LessonActions.loadLessonFailure({ error })))
                    ))
            );
    });
}
