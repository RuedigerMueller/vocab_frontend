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
    })
);
