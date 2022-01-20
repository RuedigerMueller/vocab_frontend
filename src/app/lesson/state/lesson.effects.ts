import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, concatMap, map, mergeMap, of } from 'rxjs';
import { LessonService } from 'src/app/services/lesson.service';
import * as fromActions from '../state/lesson.actions';

@Injectable()
export class LessonEffects {
    constructor(private actions$: Actions, private lessonService: LessonService) { }

    loadLessons$ = createEffect(() => {
        return this.actions$
            .pipe(
                ofType(fromActions.loadLessons),
                mergeMap(() => this.lessonService.getLessons()
                    .pipe(
                        map(lessons => fromActions.loadLessonSuccess({ lessons })),
                        catchError(error => of(fromActions.loadLessonFailure({ error })))
                    ))
            );
    });

    createLesson$ = createEffect(() => {
        return this.actions$
            .pipe(
                ofType(fromActions.createLesson),
                concatMap(action =>
                    this.lessonService.createLesson(action.lesson)
                        .pipe(
                            map(() => fromActions.createLessonSuccess({ lesson: action.lesson })),
                            catchError(error => of(fromActions.createLessonFailure({ error })))
                        )
                )
            );
    });

    updateLesson$ = createEffect(() => {
        return this.actions$
            .pipe(
                ofType(fromActions.updateLesson),
                concatMap(action =>
                    this.lessonService.updateLesson(action.lessonID, action.lesson)
                        .pipe(
                            map(() => fromActions.updateLessonSuccess({
                                lessonID: action.lessonID,
                                lesson: action.lesson
                            })),
                            catchError(error => of(fromActions.updateLessonFailure({ error })))
                        )
                )
            );
    });

    deleteLesson$ = createEffect(() => {
        return this.actions$
            .pipe(
                ofType(fromActions.deleteLesson),
                mergeMap(action =>
                    this.lessonService.deleteLesson(action.lessonID)
                        .pipe(
                            map(() => fromActions.deleteLessonSuccess({ lessonID: action.lessonID })),
                            catchError(error => of(fromActions.deleteLessonFailure({ error })))
                        )
                )
            );
    });
}
