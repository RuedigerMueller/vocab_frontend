import { createFeatureSelector, createReducer, createSelector, on } from '@ngrx/store';
import { Lesson } from 'src/app/models/lesson.model';
import * as fromApp from '../../state/app.state';
import * as fromActions from '../state/lesson.actions';


export interface State extends fromApp.State {
    lesson: LessonState;
}

export interface LessonState {
    lessons: Lesson[];
    error: string;
}

export const initialState: LessonState = {
    lessons: [],
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
    on(fromActions.loadLessonSuccess, (state, action): LessonState => {
        return {
            ...state,
            lessons: action.lessons,
            error: ''
        };
    }),
    on(fromActions.loadLessonFailure, (state, action): LessonState => {
        return {
            ...state,
            lessons: [],
            error: action.error
        };
    }),
    on(fromActions.createLessonSuccess, (state, action): LessonState => {
        return {
            ...state,
            lessons: [... state.lessons, action.lesson],
            error: ''
        };
    }),
    on(fromActions.createLessonFailure, (state, action): LessonState => {
        return {
            ...state,
            error: action.error
        };
    }),
    on(fromActions.updateLessonSuccess, (state, action): LessonState => {
        const updatedLessons = state.lessons.map(
            lesson => action.lessonID === lesson.id ? action.lesson : lesson);

        return {
            ...state,
            lessons: updatedLessons,
            error: ''
        };
    }),
    on(fromActions.updateLessonFailure, (state, action): LessonState => {
        return {
            ...state,
            error: action.error
        };
    }),
    on(fromActions.deleteLessonSuccess, (state, action): LessonState => {
        const updatedLessons = state.lessons.filter(
            lesson => action.lessonID !== lesson.id);

        return {
            ...state,
            lessons: updatedLessons,
            error: ''
        };
    }),
    on(fromActions.deleteLessonFailure, (state, action): LessonState => {
        return {
            ...state,
            error: action.error
        };
    }),
);
