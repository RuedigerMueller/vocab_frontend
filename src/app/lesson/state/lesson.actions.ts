import { createAction, props } from '@ngrx/store';
import { Lesson } from 'src/app/models/lesson.model.';

export const loadLessons = createAction(
    '[Lesson] Load lessons'
);

export const loadLessonSuccess = createAction(
    '[Lesson] Load lessons success',
    props<{ lessons: Lesson[] }>()
);

export const loadLessonFailure = createAction(
    '[Lesson] Load lesson failure',
    props<{ error: string }>()
);

export const updateLesson = createAction(
    '[Lesson] Update lesson',
    props<{ lessonID: number, lesson: Lesson }>()
);

export const updateLessonSuccess = createAction(
    '[Lesson] Update lessons success',
    props<{ lessonID: number, lesson: Lesson }>()
);

export const updateLessonFailure = createAction(
    '[Lesson] Update lesson failure',
    props<{ error: string }>()
);

export const deleteLesson = createAction(
    '[Lesson] Detete lesson',
    props<{ lessonID: number }>()
);

export const deleteLessonSuccess = createAction(
    '[Lesson] Detete lessons success',
    props<{ lessonID: number }>()
);

export const deleteLessonFailure = createAction(
    '[Lesson] Detete lesson failure',
    props<{ error: string }>()
);
