import { createFeatureSelector, createReducer, createSelector, on } from '@ngrx/store';
import { Vocabulary } from 'src/app/models/vocabulary.model';
import * as fromAppState from '../../state/app.state';

import * as fromActions from '../state/vocabulary.actions';

export interface State extends fromAppState.State {
    lessonVocabulary: VocabularyState;
}

export interface VocabularyState {
    vocabulary: Vocabulary[];
    error: string;
}

export const initialState: VocabularyState = {
    vocabulary: [],
    error: ''
};

const getVocabularyFeatureState = createFeatureSelector<VocabularyState>('lessonVocabulary');

export const getVocabulary = createSelector(
    getVocabularyFeatureState,
    state => state.vocabulary
);

export const getError = createSelector(
    getVocabularyFeatureState,
    state => state.error
);

export const selectVocabularyByID = (id: number) =>
    createSelector(
        getVocabulary,
        (lessonVocabulary: Vocabulary[]) =>
            lessonVocabulary.find(vocabulary => vocabulary.id === id)
    );

export const vocabularyReducer = createReducer<VocabularyState>(
    initialState,
    on(fromActions.loadVocabularySuccess, (state, action): VocabularyState => {
        return {
            ...state,
            vocabulary: action.vocabulary,
            error: ''
        };
    }),
    on(fromActions.loadVocabularyFailure, (state, action): VocabularyState => {
        return {
            ...state,
            vocabulary: [],
            error: action.error
        };
    }),
    on(fromActions.createVocabularySuccess, (state, action): VocabularyState => {
        return {
            ...state,
            vocabulary: [... state.vocabulary, action.vocabulary],
            error: ''
        };
    }),
    on(fromActions.createVocabularyFailure, (state, action): VocabularyState => {
        return {
            ...state,
            error: action.error
        };
    }),
    on(fromActions.updateVocabularySuccess, (state, action): VocabularyState => {
        const updatedVocabulary = state.vocabulary.map(
            vocabulary => action.vocabularyID === vocabulary.id ? action.vocabulary : vocabulary);

        return {
            ...state,
            vocabulary: updatedVocabulary,
            error: ''
        };
    }),
    on(fromActions.updateVocabularyFailure, (state, action): VocabularyState => {
        return {
            ...state,
            error: action.error
        };
    }),
    on(fromActions.deleteVocabularySuccess, (state, action): VocabularyState => {
        const updatedVocabulary = state.vocabulary.filter(
            vocabulary => action.vocabularyID !== vocabulary.id);

        return {
            ...state,
            vocabulary: updatedVocabulary,
            error: ''
        };
    }),
    on(fromActions.deleteVocabularyFailure, (state, action): VocabularyState => {
        return {
            ...state,
            error: action.error
        };
    }),
);
