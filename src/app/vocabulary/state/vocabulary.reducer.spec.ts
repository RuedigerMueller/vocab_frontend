import { Lesson } from 'src/app/models/lesson.model';
import { Vocabulary } from 'src/app/models/vocabulary.model';
import { lessonTestData } from 'test/lesson.testdata.spec';
import { vocabularyTestData } from 'test/vocabulary.testdata.spec';
import * as fromActions from '../state/vocabulary.actions';
import * as fromReducer from '../state/vocabulary.reducer';

const testLessonList: Lesson[] = lessonTestData;
const testLesson: Lesson = testLessonList[0];
const testVocabularyList: Vocabulary[] = vocabularyTestData;
const loadedState: fromReducer.VocabularyState = {
    vocabulary: testVocabularyList,
    error: ''
};
const errorMessage = 'Something went wrong!';

describe('VocabularyReducer', () => {
    describe('unknown action', () => {
        it('should return init state', () => {
            const { initialState } = fromReducer;
            const action = {
                type: 'Unknown',
            };

            const state = fromReducer.vocabularyReducer(initialState, action);

            expect(state).toBe(initialState);
        });
    });

    describe('load', () => {
        describe('success action', () => {
            it('should update the state with vocabulary in an immutable way', () => {
                const { initialState } = fromReducer;
                const newState = {
                    vocabulary: testVocabularyList,
                    error: ''
                };

                const action = fromActions.loadVocabularySuccess({ vocabulary: testVocabularyList });
                const state = fromReducer.vocabularyReducer(initialState, action);

                expect(state).toEqual(newState);
                expect(state).not.toBe(newState);
            });
        });

        describe(' failure action', () => {
            it('should update the state with and error and clear the vocabulary in an immutable way', () => {
                const newState = {
                    vocabulary: [],
                    error: errorMessage
                };

                const action = fromActions.loadVocabularyFailure({ error: errorMessage });
                const state = fromReducer.vocabularyReducer(loadedState, action);

                expect(state).toEqual(newState);
                expect(state).not.toBe(newState);
            });
        });
    });

    describe('create', () => {
        describe('success action', () => {
            it('should add the vocabulary to the lesson vocabulary in an immutable way', () => {
                const createVocabulary: Vocabulary = {
                    id: 47,
                    language_a: 'English',
                    language_b: 'Deutsch',
                    level: 1,
                    dueDate: new Date(2020, 2, 29),
                    lesson: testLesson.id
                };
                const newState = {
                    vocabulary: [...testVocabularyList, createVocabulary],
                    error: ''
                };

                const action = fromActions.createVocabularySuccess({ vocabulary: createVocabulary });
                const state = fromReducer.vocabularyReducer(loadedState, action);

                expect(state).toEqual(newState);
                expect(state).not.toBe(newState);
            });
        });

        describe('failure action', () => {
            it('should update the state with and error and clear the lessons in an immutable way', () => {
                const newState = {
                    vocabulary: [...testVocabularyList],
                    error: errorMessage
                };

                const action = fromActions.createVocabularyFailure({ error: errorMessage });
                const state = fromReducer.vocabularyReducer(loadedState, action);

                expect(state).toEqual(newState);
                expect(state).not.toBe(newState);
            });
        });
    });

    describe('update', () => {
        describe('success action', () => {
            it('should update the vocabulary in the state in an immutable way', () => {
                const updatedVocabulary: Vocabulary = testVocabularyList[0];
                updatedVocabulary.level = 3;
                const updatedVocabularyList = testVocabularyList.map(
                    vocabulary => updatedVocabulary.id === vocabulary.id ? updatedVocabulary : vocabulary);
                const newState = {
                    vocabulary: updatedVocabularyList,
                    error: ''
                };

                const action = fromActions.updateVocabularySuccess({ vocabularyID: updatedVocabulary.id, vocabulary: updatedVocabulary });
                const state = fromReducer.vocabularyReducer(loadedState, action);

                expect(state).toEqual(newState);
                expect(state).not.toBe(newState);
            });
        });

        describe('failure action', () => {
            it('should not update the lesspm vocabulary in the state and add an error to the state in an immutable way', () => {
                const newState = {
                    vocabulary: testVocabularyList,
                    error: errorMessage
                };

                const action = fromActions.updateVocabularyFailure({ error: errorMessage });
                const state = fromReducer.vocabularyReducer(loadedState, action);

                expect(state).toEqual(newState);
                expect(state).not.toBe(newState);
            });
        });
    });

    describe('delete', () => {
        describe('success action', () => {
            it('should delete the vocabulary in the state in an immutable way', () => {
                const deleteVocabulary: Vocabulary = testVocabularyList[0];
                const updatedVocabularyList = testVocabularyList.filter(
                    vocabulary => deleteVocabulary.id !== vocabulary.id);
                const newState = {
                    vocabulary: updatedVocabularyList,
                    error: ''
                };

                const action = fromActions.deleteVocabularySuccess({ vocabularyID: deleteVocabulary.id });
                const state = fromReducer.vocabularyReducer(loadedState, action);

                expect(state).toEqual(newState);
                expect(state).not.toBe(newState);
            });
        });

        describe('failure action', () => {
            it('should not update the vocabulary in the state and add an error to the state in an immutable way', () => {
                const newState = {
                    vocabulary: testVocabularyList,
                    error: errorMessage
                };

                const action = fromActions.deleteVocabularyFailure({ error: errorMessage });
                const state = fromReducer.vocabularyReducer(loadedState, action);

                expect(state).toEqual(newState);
                expect(state).not.toBe(newState);
            });
        });
    });

    describe(fromActions.clearState.type, () => {
        it('should reset the state to the initial state', () => {
            const startState = { ...loadedState };

            const action = fromActions.clearState();
            const state = fromReducer.vocabularyReducer(startState, action);

            const expectedState = {
                ...fromReducer.initialState
            };
            expect(state).toEqual(expectedState);
            expect(state).not.toBe(expectedState);
        });
    });
});


describe('VocabularySelectors', () => {
    it('should select the vocabulary', () => {
        const result: Vocabulary[] = fromReducer.getVocabulary.projector(loadedState);
        expect(result).toBe(testVocabularyList);
    });

    it('should select the error message', () => {
        const errorState: fromReducer.VocabularyState = {
            vocabulary: [],
            error: errorMessage
        };
        const result: string = fromReducer.getError.projector(errorState);
        expect(result).toBe(errorMessage);
    });

    it('should select a vocavulary by ID', () => {
        const result: Vocabulary = fromReducer.selectVocabularyByID(testVocabularyList[1].id).projector(loadedState.vocabulary);
        expect(result).toBe(testVocabularyList[1]);
    });
});
