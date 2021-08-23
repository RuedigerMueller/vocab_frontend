import { Vocabulary } from 'src/app/models/vocabulary.model';
import { vocabularyTestData } from 'test/vocabulary.testdata.spec';
import * as fromActions from '../state/quiz.actions';
import * as fromReducer from '../state/quiz.reducer';

const testVocabularyList: Vocabulary[] = vocabularyTestData;
const loadedState = {
    vocabulary: testVocabularyList,
    questionedVocabulary: 1,
    numberKnownVocabularies: 0,
    numberUnknownVocabularies: 0,
    currentVocabulary: testVocabularyList[0],
    continueQuiz: true,
    UIElementState: { ...fromReducer.initialUIElementState },
    error: ''

};
const errorMessage = 'Something went wrong!';

describe('QuizReducer', () => {
    describe('unknown action', () => {
        it('should return init state', () => {
            const startState = { ...fromReducer.initialState };
            const action = {
                type: 'Unknown',
            };

            const state = fromReducer.quizReducer(startState, action);

            expect(state).toBe(startState);
        });
    });

    describe(fromActions.loadQuizSuccess.type, () => {
        it('should update the state with due vocabulary', () => {
            const startState = { ...fromReducer.initialState };

            const action = fromActions.loadQuizSuccess({ vocabulary: testVocabularyList });
            const state = fromReducer.quizReducer(startState, action);

            // careful with the expectations: vocabulary gets randomly shuffled and the first item will be used as current vocabulary
            expect(Object.keys(state.vocabulary).length).toEqual(loadedState.vocabulary.length);
            expect(state.questionedVocabulary).toBe(1);
            expect(state.currentVocabulary).toBeTruthy();
            expect(state.error).toBe('');
        });
    });

    describe(fromActions.loadQuizFailure.type, () => {
        it('should update the state with and error and clear the due vocabulary in an immutable way', () => {
            const startState = { ...fromReducer.initialState };

            const action = fromActions.loadQuizFailure({ error: errorMessage });
            const state = fromReducer.quizReducer(startState, action);

            const expectedState = {
                ...fromReducer.initialState,
                error: errorMessage
            };
            expect(state).toEqual(expectedState);
            expect(state).not.toBe(expectedState);
        });
    });

    describe(fromActions.checkResponse.type, () => {
        it('should update the UIElementState for correct responses', () => {
            const startState = { ...loadedState };

            const action = fromActions.checkResponse({ response: startState.currentVocabulary.language_b });
            const state = fromReducer.quizReducer(startState, action);

            const expectedState = {
                ...loadedState,
                UIElementState: {
                    entryFieldState: 'success',
                    displayCheckResponseButton: false,
                    displayValidateResponseButton: false,
                    displayInvalidateResponseButton: false,
                    displayNextButton: true,
                    nextButtonType: 'positive',
                    correctResponse: '',
                }
            } as fromReducer.QuizState;
            expect(state).toEqual(expectedState);
            expect(state).not.toBe(expectedState);
        });

        it('should update the UIElementState for incorrect responses', () => {
            const startState = { ...loadedState };

            const action = fromActions.checkResponse({ response: 'wrong answer' });
            const state = fromReducer.quizReducer(startState, action);

            const expectedState = {
                ...loadedState,
                UIElementState: {
                    entryFieldState: 'error',
                    displayCheckResponseButton: false,
                    displayValidateResponseButton: true,
                    displayInvalidateResponseButton: false,
                    displayNextButton: true,
                    nextButtonType: '',
                    correctResponse: '',
                }
            } as fromReducer.QuizState;
            expect(state).toEqual(expectedState);
            expect(state).not.toBe(expectedState);
        });
    });

    describe(fromActions.validResponse.type, () => {
        it('should update the UIElementState for valid responses', () => {
            const startState = { ...loadedState };

            const action = fromActions.validResponse();
            const state = fromReducer.quizReducer(startState, action);

            const expectedState = {
                ...loadedState,
                UIElementState: {
                    entryFieldState: 'success',
                    displayCheckResponseButton: false,
                    displayValidateResponseButton: false,
                    displayInvalidateResponseButton: true,
                    displayNextButton: true,
                    nextButtonType: '',
                    correctResponse: '',
                }
            } as fromReducer.QuizState;
            expect(state).toEqual(expectedState);
            expect(state).not.toBe(expectedState);
        });
    });

    describe(fromActions.invalidResponse.type, () => {
        it('should update the UIElementState for invalid responses', () => {
            const startState = { ...loadedState };

            const action = fromActions.invalidResponse();
            const state = fromReducer.quizReducer(startState, action);

            const expectedState = {
                ...loadedState,
                UIElementState: {
                    entryFieldState: 'error',
                    displayCheckResponseButton: false,
                    displayValidateResponseButton: true,
                    displayInvalidateResponseButton: false,
                    displayNextButton: true,
                    nextButtonType: '',
                    correctResponse: '',
                }
            } as fromReducer.QuizState;
            expect(state).toEqual(expectedState);
            expect(state).not.toBe(expectedState);
        });
    });

    describe(fromActions.nextSuccess.type, () => {
        it('should move to next vocabulary and update state correcty for known voabulary', () => {
            const startState = {
                ...loadedState,
                UIElementState: {
                    ...loadedState.UIElementState,
                    entryFieldState: 'success'
                }
            } as fromReducer.QuizState;

            const action = fromActions.nextSuccess();
            const state = fromReducer.quizReducer(startState, action);

            const expectedState = {
                ...loadedState,
                questionedVocabulary: 2,
                numberKnownVocabularies: 1,
                numberUnknownVocabularies: 0,
                currentVocabulary: testVocabularyList[1],
                continueQuiz: true,
                UIElementState: { ...fromReducer.initialUIElementState },
                error: ''
            } as fromReducer.QuizState;
            expect(state).toEqual(expectedState);
            expect(state).not.toBe(expectedState);
        });

        it('should move to next vocabulary and update state correcty for unknown voabulary', () => {
            const startState = {
                ...loadedState,
                UIElementState: {
                    ...loadedState.UIElementState,
                    entryFieldState: 'error'
                }
            } as fromReducer.QuizState;

            const action = fromActions.nextSuccess();
            const state = fromReducer.quizReducer(startState, action);

            const expectedState = {
                ...loadedState,
                questionedVocabulary: 2,
                numberKnownVocabularies: 0,
                numberUnknownVocabularies: 1,
                currentVocabulary: testVocabularyList[1],
                continueQuiz: true,
                UIElementState: { ...fromReducer.initialUIElementState },
                error: ''
            } as fromReducer.QuizState;
            expect(state).toEqual(expectedState);
            expect(state).not.toBe(expectedState);
        });

        it('should correctly handle the last vocabulary in the quiz', () => {
            const startState = {
                ...loadedState,
                questionedVocabulary: testVocabularyList.length,
                UIElementState: {
                    ...loadedState.UIElementState,
                    entryFieldState: 'success'
                }
            } as fromReducer.QuizState;

            const action = fromActions.nextSuccess();
            const state = fromReducer.quizReducer(startState, action);

            const expectedState = {
                ...loadedState,
                questionedVocabulary: testVocabularyList.length,
                numberKnownVocabularies: 1,
                numberUnknownVocabularies: 0,
                currentVocabulary: {} as Vocabulary,
                continueQuiz: false,
                UIElementState: { ...fromReducer.initialUIElementState },
                error: ''
            } as fromReducer.QuizState;
            expect(state).toEqual(expectedState);
            expect(state).not.toBe(expectedState);
        });
    });

    describe(fromActions.nextFailure.type, () => {
        it('should leave state unchanged besides adding an error message in an immutable way', () => {
            const startState = { ...loadedState };

            const action = fromActions.nextFailure({ error: errorMessage });
            const state = fromReducer.quizReducer(startState, action);

            const expectedState = {
                ...loadedState,
                error: errorMessage
            };
            expect(state).toEqual(expectedState);
            expect(state).not.toBe(expectedState);
        });
    });
});

describe('QuizSelectors', () => {
    it('should select the vocabulary', () => {
        const result: Vocabulary[] = fromReducer.getVocabulary.projector(loadedState);
        expect(result).toBe(testVocabularyList);
    });

    it('should select the error message', () => {
        const errorState: fromReducer.QuizState = { ...loadedState };
        errorState.vocabulary = [];
        errorState.error = errorMessage;

        const result: string = fromReducer.getError.projector(errorState);
        expect(result).toBe(errorMessage);
    });


    it('should get the number of questioned vocabularies', () => {
        const result: number = fromReducer.getNumberQuestionedVocabularies.projector(loadedState);
        expect(result).toEqual(1);
    });

    it('should get the number of known vocabularies', () => {
        const result: number = fromReducer.getNumberKnownVocabularies.projector(loadedState);
        expect(result).toEqual(0);
    });

    it('should get the number of unknown vocabularies', () => {
        const result: number = fromReducer.getNumberUnknownVocabularies.projector(loadedState);
        expect(result).toEqual(0);
    });

    it('should get the UIElementState', () => {
        const result: fromReducer.QuizUIElementState = fromReducer.getUIElementState.projector(loadedState);
        expect(result).toEqual(fromReducer.initialUIElementState);
    });

    it('should get the number of due vocabularies', () => {
        const result: number = fromReducer.getNumberDueVocabularies.projector(loadedState);
        expect(result).toEqual(3);
    });

    it('should get information if to continue with the quiz', () => {
        const finishedState: fromReducer.QuizState = { ...loadedState };
        finishedState.continueQuiz = false;

        const result: boolean = fromReducer.continueQuiz.projector(finishedState);
        expect(result).toBe(false);
    });
});
