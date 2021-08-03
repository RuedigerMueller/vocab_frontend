import { createFeatureSelector, createReducer, createSelector, on } from '@ngrx/store';
import { Lesson } from 'src/app/models/lesson.model.';
import * as AppState from '../../state/app.state';
import * as LessonActions from '../state/lesson.actions';


export interface State extends AppState.State {
    lessons: LessonState;
}

export interface LessonState {
    lessons: Lesson[];
    activeLesson: Lesson;
    error: string;
}

const initialState: LessonState = {
    lessons: [],
    activeLesson: {
        id: -1,
        user: '',
        title: '',
        language_a: '',
        language_b: '',
        numberVocables: 0,
        numberDueVocables: 0,
    },
    error: ''
};

const getLessonFeatureState = createFeatureSelector<LessonState>('lesson');

export const getLessons = createSelector(
    getLessonFeatureState,
    state => state.lessons
);

export const selectLessonByID = (id: number) =>
    createSelector(
        getLessons,
        (lessons: Lesson[]) =>
            lessons.find(lesson => lesson.id === id)
    );

export const getError = createSelector(
    getLessonFeatureState,
    state => state.error
);

export const lessonReducer = createReducer<LessonState>(
    initialState,
    on(LessonActions.loadLessons, (state): LessonState => {
        return {
            ...state,
        };
    }),
    on(LessonActions.loadLessonSuccess, (state, action): LessonState => {
        return {
            ...state,
            lessons: action.lessons,
            error: ''
        };
    }),
    on(LessonActions.loadLessonFailure, (state, action): LessonState => {
        return {
            ...state,
            lessons: [],
            error: action.error
        };
    }),
    on(LessonActions.updateActiveLesson, (state, action): LessonState => {
        return {
            ...state,
            activeLesson: action.activeLesson
        };
    })
);
