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

export const updateActiveLesson = createAction(
    '[Lesson] Update active less',
    props<{ activeLesson: Lesson }>()
);
