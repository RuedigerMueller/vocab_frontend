import { createFeatureSelector, createReducer, createSelector, on } from '@ngrx/store';
import { Vocabulary } from 'src/app/models/vocabulary.model';
import * as AppState from '../../../state/app.state';
import * as QuizActions from '../state/quiz.actions';

export interface State extends AppState.State {
    quiz: QuizState;
}

export interface QuizUIElementState {
    entryFieldState: string;
    displayCheckResponseButton: boolean;
    displayValidateResponseButton: boolean;
    displayInvalidateResponseButton: boolean;
    displayNextButton: boolean;
    nextButtonType: string;
    correctResponse: string;
}

export interface QuizState {
    vocabulary: Vocabulary[];
    questionedVocabulary: number;
    numberKnownVocabularies: number;
    numberUnknownVocabularies: number;
    currentVocabulary: Vocabulary;
    continueQuiz: boolean;
    UIElementState: QuizUIElementState;
    error: string;
}

const initialUIElementState: QuizUIElementState = {
    entryFieldState: '',
    displayCheckResponseButton: true,
    displayValidateResponseButton: false,
    displayInvalidateResponseButton: false,
    displayNextButton: false,
    nextButtonType: '',
    correctResponse: '',
};

const initialState: QuizState = {
    vocabulary: [],
    questionedVocabulary: 0,
    numberKnownVocabularies: 0,
    numberUnknownVocabularies: 0,
    currentVocabulary: {} as Vocabulary,
    continueQuiz: true,
    UIElementState: initialUIElementState,
    error: ''
};

const getQuizFeatureState = createFeatureSelector<QuizState>('quiz');

export const getVocabulary = createSelector(
    getQuizFeatureState,
    state => state.vocabulary
);

export const getError = createSelector(
    getQuizFeatureState,
    state => state.error
);

export const getNumberQuestionedVocabularies = createSelector(
    getQuizFeatureState,
    state => state.questionedVocabulary
);

export const getNumberKnownVocabularies = createSelector(
    getQuizFeatureState,
    state => state.numberKnownVocabularies
);

export const getNumberUnknownVocabularies = createSelector(
    getQuizFeatureState,
    state => state.numberUnknownVocabularies
);

export const getCurrentVocabulary = createSelector(
    getQuizFeatureState,
    state => state.currentVocabulary
);

export const getUIElementState = createSelector(
    getQuizFeatureState,
    state => state.UIElementState
);

export const getNumberDueVocabularies = createSelector(
    getQuizFeatureState,
    state => Object.keys(state.vocabulary).length
);

export const continueQuiz = createSelector(
    getQuizFeatureState,
    state => state.continueQuiz
);

export const quizReducer = createReducer<QuizState>(
    initialState,
    on(QuizActions.loadQuizSuccess, (state, action): QuizState => {
        const shuffeledVocabulary: Vocabulary[] = shuffle(action.vocabulary);
        return {
            ...state,
            vocabulary: shuffeledVocabulary,
            questionedVocabulary: (action.vocabulary.length > 0) ? 1 : 0,
            numberKnownVocabularies: 0,
            numberUnknownVocabularies: 0,
            currentVocabulary: shuffeledVocabulary[0] ? shuffeledVocabulary[0] : {} as Vocabulary,
            error: ''
        };
    }),
    on(QuizActions.loadQuizFailure, (state, action): QuizState => {
        return {
            ...state,
            vocabulary: [],
            questionedVocabulary: 0,
            numberKnownVocabularies: 0,
            numberUnknownVocabularies: 0,
            currentVocabulary: {} as Vocabulary,
            error: action.error
        };
    }),
    on(QuizActions.checkResponse, (state, action): QuizState => {
        return {
            ...state,
            UIElementState: updateUIState(state.currentVocabulary, action.response, state.UIElementState)
        };
    }),
    on(QuizActions.validResponse, (state): QuizState => {
        return {
            ...state,
            UIElementState: setUIStateValid(state.UIElementState)
        };
    }),
    on(QuizActions.invalidResponse, (state): QuizState => {
        return {
            ...state,
            UIElementState: setUIStateInvalid(state.UIElementState)
        };
    }),
    on(QuizActions.nextSuccess, (state): QuizState => {
        return {
            ...state,
            numberKnownVocabularies:
                state.UIElementState.entryFieldState === 'success' ? state.numberKnownVocabularies + 1 : state.numberKnownVocabularies,
            numberUnknownVocabularies:
                state.UIElementState.entryFieldState === 'error' ? state.numberUnknownVocabularies + 1 : state.numberUnknownVocabularies,
             currentVocabulary:
                state.questionedVocabulary < Object.keys(state.vocabulary).length ?
                    state.vocabulary[state.questionedVocabulary] :
                    {} as Vocabulary,
            questionedVocabulary:
                state.questionedVocabulary <= Object.keys(state.vocabulary).length  ?
                    state.questionedVocabulary + 1 :
                    state.questionedVocabulary,
            continueQuiz: state.questionedVocabulary < Object.keys(state.vocabulary).length,
            UIElementState: initialUIElementState
        };
    }),
    on(QuizActions.nextFailure, (state, action): QuizState => {
        return {
            ...state,
            error: action.error
        };
    })
);

function shuffle(vocabulary: Vocabulary[]): Vocabulary[] {
    const shuffledVocabulary: Vocabulary[] = {...vocabulary};
    let currentIndex: number = vocabulary.length;
    let randomIndex: number;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [shuffledVocabulary[currentIndex], shuffledVocabulary[randomIndex]] = [
            shuffledVocabulary[randomIndex], shuffledVocabulary[currentIndex]];
    }

    return shuffledVocabulary;
}

function updateUIState(vocabulary: Vocabulary, response: string, originalUIElementState: QuizUIElementState): QuizUIElementState {
    const UIElementState: QuizUIElementState =  {...originalUIElementState };
    if (response === vocabulary.language_b) {
        UIElementState.entryFieldState = 'success';
        UIElementState.displayCheckResponseButton = false;
        UIElementState.displayValidateResponseButton = false;
        UIElementState.displayInvalidateResponseButton = false;
        UIElementState.displayNextButton = true;
        UIElementState.nextButtonType = 'positive';
    } else {
        UIElementState.entryFieldState = 'error';
        UIElementState.displayCheckResponseButton = false;
        UIElementState.displayValidateResponseButton = true;
        UIElementState.displayInvalidateResponseButton = false;
        UIElementState.displayNextButton = true;
        UIElementState.nextButtonType = '';
    }
    return UIElementState;
}

function setUIStateValid(originalUIElementState: QuizUIElementState): QuizUIElementState {
    const UIElementState: QuizUIElementState =  {...originalUIElementState };

    UIElementState.entryFieldState = 'success';
    UIElementState.displayCheckResponseButton = false;
    UIElementState.displayValidateResponseButton = false;
    UIElementState.displayInvalidateResponseButton = true;
    UIElementState.displayNextButton = true;
    UIElementState.nextButtonType = '';

    return UIElementState;
}

function setUIStateInvalid(originalUIElementState: QuizUIElementState): QuizUIElementState {
    const UIElementState: QuizUIElementState =  {...originalUIElementState };

    UIElementState.entryFieldState = 'error';
    UIElementState.displayCheckResponseButton = false;
    UIElementState.displayValidateResponseButton = true;
    UIElementState.displayInvalidateResponseButton = false;
    UIElementState.displayNextButton = true;
    UIElementState.nextButtonType = '';

    return UIElementState;
}
