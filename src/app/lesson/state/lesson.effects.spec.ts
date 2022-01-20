import { TestBed, waitForAsync } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { Observable, of, throwError } from 'rxjs';
import { Lesson } from 'src/app/models/lesson.model';
import { LessonService } from 'src/app/services/lesson.service';
import { lessonTestData } from 'test/lesson.testdata.spec';
import * as fromActions from '../state/lesson.actions';
import { LessonEffects } from './lesson.effects';

describe('LessonEffects', () => {
    const testLessonList: Lesson[] = lessonTestData;

    let actions$ = new Observable<Action>();
    let lessonEffects: LessonEffects;
    let lessonServiceSpy: any;

    beforeEach(waitForAsync(() => TestBed.configureTestingModule({
        providers: [
            LessonEffects,
            provideMockActions(() => actions$),
            {
                provide: LessonService,
                useValue: jasmine.createSpyObj('lessonService', ['getLessons', 'createLesson', 'updateLesson', 'deleteLesson'])
            }
        ]
    })));

    beforeEach(() => {
        lessonEffects = TestBed.inject<LessonEffects>(LessonEffects);
        lessonServiceSpy = TestBed.inject(LessonService);
    });

    describe('loadLessons$', () => {
        it('should return a "[Lesson] Load lessons success" action, with the lessons, on success', () => {
            actions$ = of({ type: fromActions.loadLessons.type });
            lessonServiceSpy.getLessons.and.returnValue(of(testLessonList));

            lessonEffects.loadLessons$.subscribe(action => {
                expect(action).toEqual({
                    type: fromActions.loadLessonSuccess.type,
                    lessons: testLessonList
                });
            });
        });

        it('should return a "[Lesson] Load lessons failure" action with an error in case of errors', () => {
            const errorMessage = 'There was an error';
            actions$ = of({ type: fromActions.loadLessons.type });
            lessonServiceSpy.getLessons.and.returnValue(throwError(errorMessage));

            lessonEffects.loadLessons$.subscribe(action => {
                expect(action).toEqual({
                    type: fromActions.loadLessonFailure.type,
                    error: errorMessage
                });
            });
        });

    });

    describe('createLesson$', () => {
        it('should return a "[Lesson] Create Lesson success" action, with the created lesson, on success', () => {
            const createdLesson = testLessonList[0];
            actions$ = of({
                type: fromActions.createLesson.type,
                lesson: createdLesson
            });
            lessonServiceSpy.createLesson.and.returnValue(of(createdLesson));

            lessonEffects.createLesson$.subscribe(action => {
                expect(action).toEqual({
                    type: fromActions.createLessonSuccess.type,
                    lesson: createdLesson
                });
            });
        });

        it('should return a "[Lesson] Create lessons failure" action with an error in case of errors', () => {
            const createdLesson = testLessonList[0];
            const errorMessage = 'There was an error';
            actions$ = of({
                type: fromActions.createLesson.type,
                lesson: createdLesson
            });
            lessonServiceSpy.createLesson.and.returnValue(throwError(errorMessage));

            lessonEffects.createLesson$.subscribe(action => {
                expect(action).toEqual({
                    type: fromActions.createLessonFailure.type,
                    error: errorMessage
                });
            });
        });
    });

    describe('updateLesson$', () => {
        it('should return a "[Lesson] Update lessons success" action, with the updated lesson, on success', () => {
            const updatedLesson = testLessonList[1];
            actions$ = of({
                type: fromActions.updateLesson.type,
                lessonID: updatedLesson.id,
                lesson: updatedLesson
            });
            lessonServiceSpy.updateLesson.and.returnValue(of(updatedLesson));

            lessonEffects.updateLesson$.subscribe(action => {
                expect(action).toEqual({
                    type: fromActions.updateLessonSuccess.type,
                    lessonID: updatedLesson.id,
                    lesson: updatedLesson
                });
            });
        });

        it('should return a "[Lesson] Update lessons failure" action with an error in case of errors', () => {
            const updatedLesson = testLessonList[1];
            const errorMessage = 'There was an error';
            actions$ = of({
                type: fromActions.updateLesson.type,
                lessonID: updatedLesson.id,
                lesson: updatedLesson
            });
            lessonServiceSpy.updateLesson.and.returnValue(throwError(errorMessage));

            lessonEffects.updateLesson$.subscribe(action => {
                expect(action).toEqual({
                    type: fromActions.updateLessonFailure.type,
                    error: errorMessage
                });
            });
        });
    });

    describe('deleteLesson$', () => {
        it('should return a "[Lesson] Delete lessons success" action, with the deleted lesson, on success', () => {
            const deletedLesson = testLessonList[2];
            actions$ = of({
                type: fromActions.deleteLesson.type,
                lessonID: deletedLesson.id
            });
            lessonServiceSpy.deleteLesson.and.returnValue(of(deletedLesson));

            lessonEffects.deleteLesson$.subscribe(action => {
                expect(action).toEqual({
                    type: fromActions.deleteLessonSuccess.type,
                    lessonID: deletedLesson.id
                });
            });
        });

        it('should return a "[Lesson] Delete lessons failure" action with an error in case of errors', () => {
            const deletedLesson = testLessonList[2];
            const errorMessage = 'There was an error';
            actions$ = of({
                type: fromActions.deleteLesson.type,
                lessonID: deletedLesson.id
            });
            lessonServiceSpy.deleteLesson.and.returnValue(throwError(errorMessage));

            lessonEffects.deleteLesson$.subscribe(action => {
                expect(action).toEqual({
                    type: fromActions.deleteLessonFailure.type,
                    error: errorMessage
                });
            });
        });
    });

});
