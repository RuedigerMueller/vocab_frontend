import { Location } from '@angular/common';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { ButtonModule, MenuModule, SplitButtonComponent, SplitButtonModule, TableModule } from '@fundamental-ngx/core';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { cold } from 'jasmine-marbles';
import { routes } from 'src/app/app-routing.module';
import { AuthGuardService } from 'src/app/helpers/auth-guard.service';
import { Lesson } from 'src/app/models/lesson.model.';
import { frontend } from 'src/app/resource.identifiers';
import { LessonService } from 'src/app/services/lesson.service';
import { lessonTestData } from 'test/lesson.testdata.spec';
import * as LessonActions from '../state/lesson.actions';
import { State } from '../state/lesson.reducer';
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
    const loadedState = {
        lesson: {
            lessons: testLessonList,
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
            mockStore.setState(loadedState);

            fixture.detectChanges();

            const expected = cold('a', { a: testLessonList });
            expect(component.lessons$).toBeObservable(expected);
        });

        it('should not have errors initially', () => {
            const expected = cold('a', { a: '' });
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

            const expected = cold('a', { a: 'Error from action.' });
            expect(component.errorMessage$).toBeObservable(expected);
        });
    });

    describe('should render UI elements', () => {
        it('should have the required column headings', () => {
            mockStore.setState(loadedState);

            fixture.detectChanges();

            const expectedColumns: ReadonlyArray<string> = ['Title', 'Learned Language', 'Known Language', '#Vocabularies', '#Due Vocabularies', 'Actions'];
            const tableHeaders: NodeListOf<HTMLLabelElement> = fixture.nativeElement.querySelectorAll('th');
            let success = true;
            for (const column of expectedColumns) {
                let found = false;
                tableHeaders.forEach((header) => {
                    if (header.textContent === column) {
                        found = true;
                    }
                });

                if (found === false) {
                    success = false;
                    expect(found).toBeTruthy(`Column ${column} not found`);
                }
            }
            expect(success).toBeTruthy('All expected columns rendered');
        });

        it('should display a lesson as defined in second test data entry', () => {
            mockStore.setState(loadedState);

            fixture.detectChanges();

            const index = 1; // second element defined in testLessons
            const titleCell: HTMLTableCellElement = fixture.nativeElement.querySelector(`#list-lessons-title-${index}`);
            expect(titleCell.textContent).toContain(testLessonList[index].title, 'Lesson title is missing');
            const languageACell: HTMLTableCellElement = fixture.nativeElement.querySelector(`#list-lessons-language_a-${index}`);
            expect(languageACell.textContent).toContain(testLessonList[index].language_a, 'Language_A is missing');
            const languageBCell: HTMLTableCellElement = fixture.nativeElement.querySelector(`#list-lessons-language_b-${index}`);
            expect(languageBCell.textContent).toContain(testLessonList[index].language_b, 'Language B is missing');
            const numberCell: HTMLTableCellElement = fixture.nativeElement.querySelector(`#list-lessons-numberVocables-${index}`);
            expect(numberCell.textContent).toContain(testLessonList[index].numberVocables.toString(), 'Number vocabularies is missing');
            const numberDueCell: HTMLTableCellElement = fixture.nativeElement.querySelector(`#list-lessons-numberDueVocables-${index}`);
            expect(numberDueCell.textContent).toContain(testLessonList[index].numberDueVocables.toString(), 'Number due vocabularies is missing');
        });
    });

    describe('should have required actions', () => {
        it('should have required buttons', () => {
            mockStore.setState(loadedState);

            fixture.detectChanges();

            const expectedActions: ReadonlyArray<string> = ['Create', 'Quiz'];
            const actions: NodeListOf<HTMLButtonElement> = fixture.nativeElement.querySelectorAll('button');
            let success = true;
            for (const expectedAction of expectedActions) {
                let found = false;
                actions.forEach((action) => {
                    if (action.textContent.trim() === expectedAction) {
                        found = true;
                    }
                });

                if (found === false) {
                    success = false;
                    expect(found).toBeTruthy(`Action ${expectedAction} not found`);
                }
            }
            expect(success).toBeTruthy('All expected actions rendered');
        });

        it('should have the required actions as part of the split button', () => {
            mockStore.setState(loadedState);

            fixture.detectChanges();

            const splitButtonComponent = fixture.debugElement.query(By.directive(SplitButtonComponent));
            const splitButtonComponentInstance: SplitButtonComponent = splitButtonComponent.injector.get(SplitButtonComponent);
            const expectedActions: ReadonlyArray<string> = ['Edit', 'Delete', 'Vocabulary'];
            let success = true;
            for (const expectedAction of expectedActions) {
                let found = false;
                for (const menuItem of splitButtonComponentInstance.menu.menuItems) {
                    if (menuItem.menuItemTitle.title.trim() === expectedAction) {
                        found = true;
                    }
                }

                if (found === false) {
                    success = false;
                    expect(found).toBeTruthy(`Action ${expectedAction} not found`);
                }
            }
            expect(success).toBeTruthy('All expected actions rendered');
        });
    });

    describe('should route correctly on actions', () => {
        it('should navigate to add-lesson component when clicking "Create"', () => {
            mockStore.setState(loadedState);
            spyOn(router, 'navigateByUrl').and.stub();

            fixture.detectChanges();

            component.createLesson();

            expect(router.navigateByUrl).toHaveBeenCalledWith(`/${frontend.lessons}/${frontend.createLesson}`);
        });

        it('should navigate to edit-lesson component when clicking "Edit"', () => {
            mockStore.setState(loadedState);
            spyOn(router, 'navigateByUrl').and.stub();

            fixture.detectChanges();
            component.updateLesson(testLessonList[0].id);
            expect(router.navigateByUrl).toHaveBeenCalledWith(`/${frontend.lessons}/${testLessonList[0].id}/${frontend.editLesson}`);
        });

        it('should stay on list-lessons component when clicking "Delete"', () => {
            mockStore.setState(loadedState);
            spyOn(router, 'navigateByUrl').and.stub();

            fixture.detectChanges();
            component.deleteLesson(testLessonList[0].id);

            expect(router.navigateByUrl).toHaveBeenCalledTimes(0);
        });

        it('should navigate to listVocabularies component when clicking "Vocabulary"', () => {
            mockStore.setState(loadedState);
            spyOn(router, 'navigateByUrl').and.stub();

            fixture.detectChanges();
            component.lessonVocabulary(testLessonList[0].id);

            expect(router.navigateByUrl).toHaveBeenCalledWith(`/${frontend.lessons}/${testLessonList[0].id}/${frontend.vocabulary}`);
        });

        it('should navigate to quiz component when clicking "Quiz"', () => {
            mockStore.setState(loadedState);
            spyOn(router, 'navigateByUrl').and.stub();

            fixture.detectChanges();
            const splitButton: HTMLElement = fixture.nativeElement.querySelector('#list-lessons-quizAction-0');
            const quizButton: HTMLButtonElement = splitButton.querySelectorAll('button')[0];
            quizButton.click();

            expect(router.navigateByUrl).toHaveBeenCalledWith(`/${frontend.lessons}/${testLessonList[0].id}/${frontend.quiz}`);
        });
    });
});
