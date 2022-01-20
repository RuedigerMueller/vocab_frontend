import { TestBed, waitForAsync } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { Observable, of, throwError } from 'rxjs';
import { Lesson } from 'src/app/models/lesson.model';
import { Vocabulary } from 'src/app/models/vocabulary.model';
import { VocabularyService } from 'src/app/services/vocabulary.service';
import { lessonTestData } from 'test/lesson.testdata.spec';
import { vocabularyTestData } from 'test/vocabulary.testdata.spec';
import * as fromActions from '../state/vocabulary.actions';
import { VocabularyEffects } from './vocabulary.effects';

describe('VocabularyEffects', () => {
    const testLessonList: Lesson[] = lessonTestData;
    const testLesson: Lesson = testLessonList[0];
    const testVocabularyList: Vocabulary[] = vocabularyTestData;

    let actions$ = new Observable<Action>();
    let vocabularyEffects: VocabularyEffects;
    let vocabularyServiceSpy: any;

    beforeEach(waitForAsync(() => TestBed.configureTestingModule({
        providers: [
            VocabularyEffects,
            provideMockActions(() => actions$),
            {
                provide: VocabularyService,
                useValue: jasmine.createSpyObj('vocabularyService', ['getLessonVocabulary', 'createVocabulary', 'updateVocabulary', 'deleteVocabulary'])
            }
        ]
    })));

    beforeEach(() => {
        vocabularyEffects = TestBed.inject<VocabularyEffects>(VocabularyEffects);
        vocabularyServiceSpy = TestBed.inject(VocabularyService);
    });

    describe('loadVocabulary$', () => {
        it('should return a "[Vocabulary] Load vocabulary success" action, with the lesson vocabulary, on success', () => {
            actions$ = of({
                type: fromActions.loadVocabulary.type,
                lessonID: testLesson.id
            });
            vocabularyServiceSpy.getLessonVocabulary.and.returnValue(of(testVocabularyList));

            vocabularyEffects.loadVocabulary$.subscribe(action => {
                expect(action).toEqual({
                    type: fromActions.loadVocabularySuccess.type,
                    vocabulary: testVocabularyList
                });
            });
        });

        it('should return a "[Vocabulary] Load vocabulary failure" action with an error in case of errors', () => {
            const errorMessage = 'There was an error';
            actions$ = of({
                type: fromActions.loadVocabulary.type,
                lessonID: testLesson.id
            });
            vocabularyServiceSpy.getLessonVocabulary.and.returnValue(throwError(errorMessage));

            vocabularyEffects.loadVocabulary$.subscribe(action => {
                expect(action).toEqual({
                    type: fromActions.loadVocabularyFailure.type,
                    error: errorMessage
                });
            });
        });

    });

    describe('createVocabulary$', () => {
        it('should return a "[Vocabulary] Create vocabulary success" action, with the created vocabulary, on success', () => {
            const createVocabulary = testVocabularyList[0];
            actions$ = of({
                type: fromActions.createVocabulary.type,
                vocabulary: createVocabulary
            });
            vocabularyServiceSpy.createVocabulary.and.returnValue(of(createVocabulary));

            vocabularyEffects.createVocabulary$.subscribe(action => {
                expect(action).toEqual({
                    type: fromActions.createVocabularySuccess.type,
                    vocabulary: createVocabulary
                });
            });
        });

        it('should return a "[Vocabulary] Create vocabulary failure" action with an error in case of errors', () => {
            const createVocabulary = testVocabularyList[0];
            const errorMessage = 'There was an error';
            actions$ = of({
                type: fromActions.createVocabulary.type,
                vocabulary: createVocabulary
            });
            vocabularyServiceSpy.createVocabulary.and.returnValue(throwError(errorMessage));

            vocabularyEffects.createVocabulary$.subscribe(action => {
                expect(action).toEqual({
                    type: fromActions.createVocabularyFailure.type,
                    error: errorMessage
                });
            });
        });
    });

    describe('updateVocabulary$', () => {
        it('should return a "[Vocabulary] Update vocabulary success" action, with the updated vocabulary, on success', () => {
            const updatedVocabulary = testVocabularyList[1];
            actions$ = of({
                type: fromActions.updateVocabulary.type,
                vocabularyID: updatedVocabulary.id,
                vocabulary: updatedVocabulary
            });
            vocabularyServiceSpy.updateVocabulary.and.returnValue(of(updatedVocabulary));

            vocabularyEffects.updateVocabulary$.subscribe(action => {
                expect(action).toEqual({
                    type: fromActions.updateVocabularySuccess.type,
                    vocabularyID: updatedVocabulary.id,
                    vocabulary: updatedVocabulary
                });
            });
        });

        it('should return a "[Vocabulary] Update vocabulary failure" action with an error in case of errors', () => {
            const updatedVocabulary = testVocabularyList[1];
            const errorMessage = 'There was an error';
            actions$ = of({
                type: fromActions.updateVocabulary.type,
                vocabularyID: updatedVocabulary.id,
                vocabulary: updatedVocabulary
            });
            vocabularyServiceSpy.updateVocabulary.and.returnValue(throwError(errorMessage));

            vocabularyEffects.updateVocabulary$.subscribe(action => {
                expect(action).toEqual({
                    type: fromActions.updateVocabularyFailure.type,
                    error: errorMessage
                });
            });
        });
    });

    describe('deleteVocabulary$', () => {
        it('should return a "[Vocabulary] Delete vocabulary success" action, with the deleted vocabulary, on success', () => {
            const deletedVocabulary = testVocabularyList[2];
            actions$ = of({
                type: fromActions.deleteVocabulary.type,
                vocabularyID: deletedVocabulary.id
            });
            vocabularyServiceSpy.deleteVocabulary.and.returnValue(of(deletedVocabulary));

            vocabularyEffects.deleteVocabulary$.subscribe(action => {
                expect(action).toEqual({
                    type: fromActions.deleteVocabularySuccess.type,
                    vocabularyID: deletedVocabulary.id
                });
            });
        });

        it('should return a "[Vocabulary] Delete vocabulary failure" action with an error in case of errors', () => {
            const deletedVocabulary = testVocabularyList[2];
            const errorMessage = 'There was an error';
            actions$ = of({
                type: fromActions.deleteVocabulary.type,
                vocabularyID: deletedVocabulary.id
            });
            vocabularyServiceSpy.deleteVocabulary.and.returnValue(throwError(errorMessage));

            vocabularyEffects.deleteVocabulary$.subscribe(action => {
                expect(action).toEqual({
                    type: fromActions.deleteVocabularyFailure.type,
                    error: errorMessage
                });
            });
        });
    });
});
