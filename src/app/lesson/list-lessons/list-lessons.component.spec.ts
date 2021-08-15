import { Location } from '@angular/common';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { ButtonModule, MenuModule, SplitButtonModule, TableModule } from '@fundamental-ngx/core';
import { MemoizedSelector } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { cold, getTestScheduler } from 'jasmine-marbles';
import { routes } from 'src/app/app-routing.module';
import { AuthGuardService } from 'src/app/helpers/auth-guard.service';
import { Lesson } from 'src/app/models/lesson.model.';
import { LessonService } from 'src/app/services/lesson.service';
import { lessonTestData } from 'test/lesson.testdata.spec';
import * as LessonActions from '../state/lesson.actions';
import { getError, getLessons, State } from '../state/lesson.reducer';
import { ListLessonsComponent } from './list-lessons.component';

describe('ListLessonsComponent', () => {
    const testLessonList: Lesson[] = lessonTestData;

    let location: Location;
    let router: Router;
    let mockStore: MockStore<State>;
    const initialState = {
        lesson: {
            lessons: [],
            error: ''
        }
    } as State;

    let component: ListLessonsComponent;
    let fixture: ComponentFixture<ListLessonsComponent>;


    beforeEach(waitForAsync(() => {
        const mockLessonService = jasmine.createSpyObj('LessonService', ['getLessons', 'deleteLesson']);
        const authGuardService: any = jasmine.createSpyObj('AuthGuardService', ['canActivate']);

        TestBed.configureTestingModule({
            declarations: [ListLessonsComponent],
            imports: [
                RouterTestingModule.withRoutes(routes),
                TableModule,
                ButtonModule,
                SplitButtonModule,
                MenuModule
            ],
            providers: [
                provideMockStore({ initialState }),
                { provide: LessonService, useValue: mockLessonService },
                { provide: AuthGuardService, useValue: authGuardService },
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        router = TestBed.inject(Router);
        location = TestBed.inject(Location);
        mockStore = TestBed.inject(MockStore);
        fixture = TestBed.createComponent(ListLessonsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    describe('component', () => {
        it('should create', () => {
            expect(component).toBeTruthy();
        });

        it('should dispatch a loadLessons action OnInit', () => {
            component.ngOnInit();

            const expected = cold('a', { a: LessonActions.loadLessons() });
            expect(mockStore.scannedActions$).toBeObservable(expected);
        });

        it('should contain lesson data after loading', () => {
            const loadedState = {
                lesson: {
                    lessons: testLessonList,
                    error: ''
                }
            } as State;
            mockStore.setState(loadedState);

            fixture.detectChanges();

            const expected = cold('a', {a: testLessonList});
            expect(component.lessons$).toBeObservable(expected);
        });

        it('should not have errors initially', () => {
            const expected = cold('a', {a: ''});
            expect(component.errorMessage$).toBeObservable(expected);
        });

        it('should have errors when an action reported an error', () => {
            const errorState = {
                lesson: {
                    lessons: [],
                    error: 'Error from action.'
                }
            } as State;
            mockStore.setState(errorState);

            fixture.detectChanges();

            const expected = cold('a', {a: 'Error from action.'});
            expect(component.errorMessage$).toBeObservable(expected);
        });
    });
});
