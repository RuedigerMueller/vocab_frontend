import { createFeatureSelector, createReducer, createSelector, on } from '@ngrx/store';
import { Vocabulary } from 'src/app/models/vocabulary.model';
import * as AppState from '../../state/app.state';

import * as VocabularyActions from '../state/vocabulary.actions';

export interface State extends AppState.State {
    vocabulary: VocabularyState;
}

export interface VocabularyState {
    vocabulary: Vocabulary[];
    error: string;
}

const initialState: VocabularyState = {
    vocabulary: [],
    error: ''
};

const getVocabularyFeatureState = createFeatureSelector<VocabularyState>('vocabulary');

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
    on(VocabularyActions.loadVocabulary, (state): VocabularyState => {
        return {
            ...state,
        };
    }),
    on(VocabularyActions.loadVocabularySuccess, (state, action): VocabularyState => {
        return {
            ...state,
            vocabulary: action.vocabulary,
            error: ''
        };
    }),
    on(VocabularyActions.loadVocabularyFailure, (state, action): VocabularyState => {
        return {
            ...state,
            vocabulary: [],
            error: action.error
        };
    }),
    on(VocabularyActions.createVocabulary, (state): VocabularyState => {
        return {
            ...state,
        };
    }),
    on(VocabularyActions.createVocabularySuccess, (state, action): VocabularyState => {
        return {
            ...state,
            vocabulary: [... state.vocabulary, action.vocabulary],
            error: ''
        };
    }),
    on(VocabularyActions.createVocabularyFailure, (state, action): VocabularyState => {
        return {
            ...state,
            error: action.error
        };
    }),
    on(VocabularyActions.updateVocabulary, (state): VocabularyState => {
        return {
            ...state,
        };
    }),
    on(VocabularyActions.updateVocabularySuccess, (state, action): VocabularyState => {
        const updatedVocabulary = state.vocabulary.map(
            vocabulary => action.vocabularyID === vocabulary.id ? action.vocabulary : vocabulary);

        return {
            ...state,
            vocabulary: updatedVocabulary,
            error: ''
        };
    }),
    on(VocabularyActions.updateVocabularyFailure, (state, action): VocabularyState => {
        return {
            ...state,
            vocabulary: [],
            error: action.error
        };
    }),
    on(VocabularyActions.deleteVocabulary, (state): VocabularyState => {
        return {
            ...state,
        };
    }),
    on(VocabularyActions.deleteVocabularySuccess, (state, action): VocabularyState => {
        const updatedVocabulary = state.vocabulary.filter(
            vocabulary => action.vocabularyID !== vocabulary.id);

        return {
            ...state,
            vocabulary: updatedVocabulary,
            error: ''
        };
    }),
    on(VocabularyActions.deleteVocabularyFailure, (state, action): VocabularyState => {
        return {
            ...state,
            vocabulary: [],
            error: action.error
        };
    }),
);
