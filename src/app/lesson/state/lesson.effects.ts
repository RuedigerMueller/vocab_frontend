import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, concatMap, map, mergeMap } from 'rxjs/operators';
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

    updateLesson$ = createEffect(() => {
        return this.actions$
            .pipe(
                ofType(LessonActions.updateLesson),
                concatMap(action =>
                    this.lessonService.updateLesson(action.lessonID, action.lesson)
                      .pipe(
                        map(lesson => LessonActions.updateLessonSuccess({ lessonID: action.lessonID, lesson })),
                        catchError(error => of(LessonActions.updateLessonFailure({ error })))
                      )
                  )
            );
    });

    deleteLesson$ = createEffect(() => {
        return this.actions$
            .pipe(
                ofType(LessonActions.deleteLesson),
                mergeMap(action =>
                    this.lessonService.deleteLesson(action.lessonID)
                      .pipe(
                        map(() => LessonActions.deleteLessonSuccess({ lessonID: action.lessonID })),
                        catchError(error => of(LessonActions.deleteLessonFailure({ error })))
                      )
                  )
            );
    });
}
