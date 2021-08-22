import { Lesson } from 'src/app/models/lesson.model.';
import { lessonTestData } from 'test/lesson.testdata.spec';
import * as fromActions from '../state/lesson.actions';
import * as fromReducer from '../state/lesson.reducer';

const testLessonList: Lesson[] = lessonTestData;
const loadedState: fromReducer.LessonState = {
    lessons: testLessonList,
    error: ''
};
const errorMessage = 'Something went wrong!';

describe('LessonReducer', () => {
    describe('unknown action', () => {
        it('should return init state', () => {
            const { initialState } = fromReducer;
            const action = {
                type: 'Unknown',
            };

            const state = fromReducer.lessonReducer(initialState, action);

            expect(state).toBe(initialState);
        });
    });

    describe('load', () => {
        describe('success action', () => {
            it('should update the state with lessons in an immutable way', () => {
                const { initialState } = fromReducer;
                const newState = {
                    lessons: testLessonList,
                    error: ''
                };

                const action = fromActions.loadLessonSuccess({ lessons: testLessonList });
                const state = fromReducer.lessonReducer(initialState, action);

                expect(state).toEqual(newState);
                expect(state).not.toBe(newState);
            });
        });

        describe(' failure action', () => {
            it('should update the state with and error and clear the lessons in an immutable way', () => {
                const newState = {
                    lessons: [],
                    error: errorMessage
                };

                const action = fromActions.loadLessonFailure({ error: errorMessage });
                const state = fromReducer.lessonReducer(loadedState, action);

                expect(state).toEqual(newState);
                expect(state).not.toBe(newState);
            });
        });
    });

    describe('create', () => {
        describe('success action', () => {
            it('should add the lesson to the lessons in an immutable way', () => {
                const createdLesson: Lesson = {
                    id: 2,
                    user: 'User1',
                    title: 'Unit 2',
                    language_a: 'English',
                    language_b: 'Deutsch', numberVocables: 0, numberDueVocables: 0
                };
                const newState = {
                    lessons: [...testLessonList, createdLesson],
                    error: ''
                };

                const action = fromActions.createLessonSuccess({ lesson: createdLesson });
                const state = fromReducer.lessonReducer(loadedState, action);

                expect(state).toEqual(newState);
                expect(state).not.toBe(newState);
            });
        });

        describe(' failure action', () => {
            it('should update the state with and error and clear the lessons in an immutable way', () => {
                const newState = {
                    lessons: [...testLessonList],
                    error: errorMessage
                };

                const action = fromActions.createLessonFailure({ error: errorMessage });
                const state = fromReducer.lessonReducer(loadedState, action);

                expect(state).toEqual(newState);
                expect(state).not.toBe(newState);
            });
        });
    });

    describe('update', () => {
        describe('success action', () => {
            it('should update the lesson in the state in an immutable way', () => {
                const updatedLesson: Lesson = testLessonList[0];
                updatedLesson.title = 'Updated title';
                const updatedLessonList = testLessonList.map(
                    lesson => updatedLesson.id === lesson.id ? updatedLesson : lesson);
                const newState = {
                    lessons: updatedLessonList,
                    error: ''
                };

                const action = fromActions.updateLessonSuccess({ lessonID: updatedLesson.id, lesson: updatedLesson });
                const state = fromReducer.lessonReducer(loadedState, action);

                expect(state).toEqual(newState);
                expect(state).not.toBe(newState);
            });
        });

        describe(' failure action', () => {
            it('should not update the lesson in the state and add an error to the state in an immutable way', () => {
                const newState = {
                    lessons: testLessonList,
                    error: errorMessage
                };

                const action = fromActions.updateLessonFailure({ error: errorMessage });
                const state = fromReducer.lessonReducer(loadedState, action);

                expect(state).toEqual(newState);
                expect(state).not.toBe(newState);
            });
        });
    });

    describe('delete', () => {
        describe('success action', () => {
            it('should delete the lesson in the state in an immutable way', () => {
                const deleteLesson: Lesson = testLessonList[0];
                const updatedLessonList = testLessonList.filter(
                    lesson => deleteLesson.id !== lesson.id);
                const newState = {
                    lessons: updatedLessonList,
                    error: ''
                };

                const action = fromActions.deleteLessonSuccess({ lessonID: deleteLesson.id });
                const state = fromReducer.lessonReducer(loadedState, action);

                expect(state).toEqual(newState);
                expect(state).not.toBe(newState);
            });
        });

        describe(' failure action', () => {
            it('should not update the lesson in the state and add an error to the state in an immutable way', () => {
                const newState = {
                    lessons: testLessonList,
                    error: errorMessage
                };

                const action = fromActions.deleteLessonFailure({ error: errorMessage });
                const state = fromReducer.lessonReducer(loadedState, action);

                expect(state).toEqual(newState);
                expect(state).not.toBe(newState);
            });
        });
    });
});


describe('LessonSelectors', () => {
    it('should select the lessons', () => {
        const result: Lesson[] = fromReducer.getLessons.projector(loadedState);
        expect(result).toBe(testLessonList);
    });

    it('should select a lesson by ID', () => {
        const result: Lesson = fromReducer.selectLessonByID(testLessonList[1].id).projector(loadedState.lessons);
        expect(result).toBe(testLessonList[1]);
    });

    it('should select the error message', () => {
        const errorState: fromReducer.LessonState = {
            lessons: [],
            error: errorMessage
        };
        const result: string = fromReducer.getError.projector(errorState);
        expect(result).toBe(errorMessage);
    });
});
