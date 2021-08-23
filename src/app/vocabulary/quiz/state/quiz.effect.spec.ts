import { TestBed, waitForAsync } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { Observable, of, throwError } from 'rxjs';
import { Lesson } from 'src/app/models/lesson.model.';
import { Vocabulary } from 'src/app/models/vocabulary.model';
import { VocabularyService } from 'src/app/services/vocabulary.service';
import { lessonTestData } from 'test/lesson.testdata.spec';
import { vocabularyTestData } from 'test/vocabulary.testdata.spec';
import * as fromActions from '../state/quiz.actions';
import { QuizEffects } from './quiz.effects';

describe('QuizEffects', () => {
    const testLessonList: Lesson[] = lessonTestData;
    const testLesson: Lesson = testLessonList[0];
    const testVocabularyList: Vocabulary[] = vocabularyTestData;

    let actions$ = new Observable<Action>();
    let quizEffects: QuizEffects;
    let vocabularyServiceSpy: any;

    beforeEach(waitForAsync(() => TestBed.configureTestingModule({
        providers: [
            QuizEffects,
            provideMockActions(() => actions$),
            {
                provide: VocabularyService,
                useValue: jasmine.createSpyObj('vocabularyService', ['getDueLessonVocabulary', 'vocabularyKnown', 'vocabularyUnknown'])
            }
        ]
    })));

    beforeEach(() => {
        quizEffects = TestBed.inject<QuizEffects>(QuizEffects);
        vocabularyServiceSpy = TestBed.inject(VocabularyService);
    });

    describe('loadQuiz$', () => {
        it('should return a "[Quiz] Load vocabulary success" action, with the due lesson vocabulary, on success', () => {
            actions$ = of({
                type: fromActions.loadQuiz.type,
                lessonID: testLesson.id
            });
            vocabularyServiceSpy.getDueLessonVocabulary.and.returnValue(of(testVocabularyList));

            quizEffects.loadQuiz$.subscribe(action => {
                expect(action).toEqual({
                    type: fromActions.loadQuizSuccess.type,
                    vocabulary: testVocabularyList
                });
            });
        });

        it('should return a "[Quiz] Load vocabulary failure" action with an error in case of errors', () => {
            const errorMessage = 'There was an error';
            actions$ = of({
                type: fromActions.loadQuiz.type,
                lessonID: testLesson.id
            });
            vocabularyServiceSpy.getDueLessonVocabulary.and.returnValue(throwError(errorMessage));

            quizEffects.loadQuiz$.subscribe(action => {
                expect(action).toEqual({
                    type: fromActions.loadQuizFailure.type,
                    error: errorMessage
                });
            });
        });

    });

    describe('next$', () => {
        it('should inform backend about known vocabulary and return a "[Quiz] Next success" action on success', () => {
            const questionedVocabulary = testVocabularyList[0];
            actions$ = of({
                type: fromActions.next.type,
                vocabularyID: questionedVocabulary.id,
                responseState: 'success'
            });
            vocabularyServiceSpy.vocabularyKnown.and.returnValue(of());

            quizEffects.next$.subscribe(action => {
                expect(action).toEqual({
                    type: fromActions.nextSuccess.type,
                });
                expect(vocabularyServiceSpy.vocabularyKnown).toHaveBeenCalled();
                expect(vocabularyServiceSpy.vocabularyUnknown).not.toHaveBeenCalled();
            });
        });

        it('should inform backend about unknown vocabulary and return a "[Quiz] Next success" action and  on success', () => {
            const questionedVocabulary = testVocabularyList[0];
            actions$ = of({
                type: fromActions.next.type,
                vocabularyID: questionedVocabulary.id,
                responseState: 'error'
            });
            vocabularyServiceSpy.vocabularyUnknown.and.returnValue(of());

            quizEffects.next$.subscribe(action => {
                expect(action).toEqual({
                    type: fromActions.nextSuccess.type,
                });
                expect(vocabularyServiceSpy.vocabularyUnknown).toHaveBeenCalled();
                expect(vocabularyServiceSpy.vocabularyKnown).not.toHaveBeenCalled();
            });
        });

        it('should inform backend about known vocabulary & return a "[Quiz] Next failure" with an error in case of errors', () => {
            const questionedVocabulary = testVocabularyList[0];
            const errorMessage = 'There was an error';
            actions$ = of({
                type: fromActions.next.type,
                vocabularyID: questionedVocabulary.id,
                responseState: 'success'
            });
            vocabularyServiceSpy.vocabularyKnown.and.returnValue(throwError(errorMessage));

            quizEffects.next$.subscribe(action => {
                expect(action).toEqual({
                    type: fromActions.nextFailure.type,
                    error: errorMessage
                });
            });
        });

        it('should inform backend about unknown vocabulary & return a "[Quiz] Next failure" with an error in case of errors', () => {
            const questionedVocabulary = testVocabularyList[0];
            const errorMessage = 'There was an error';
            actions$ = of({
                type: fromActions.next.type,
                vocabularyID: questionedVocabulary.id,
                responseState: 'error'
            });
            vocabularyServiceSpy.vocabularyUnknown.and.returnValue(throwError(errorMessage));

            quizEffects.next$.subscribe(action => {
                expect(action).toEqual({
                    type: fromActions.nextFailure.type,
                    error: errorMessage
                });
            });
        });
    });
});
