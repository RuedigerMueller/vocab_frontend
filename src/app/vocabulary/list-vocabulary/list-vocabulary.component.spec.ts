import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ActivatedRoute, convertToParamMap, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { ButtonModule, MenuModule, SplitButtonComponent, SplitButtonModule, TableModule } from '@fundamental-ngx/core';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { cold } from 'jasmine-marbles';
import { routes } from 'src/app/app-routing.module';
import { Lesson } from 'src/app/models/lesson.model';
import { Vocabulary } from 'src/app/models/vocabulary.model';
import { frontend } from 'src/app/resource.identifiers';
import { lessonTestData } from 'test/lesson.testdata.spec';
import { vocabularyTestData } from 'test/vocabulary.testdata.spec';
import * as fromVocabularyActions from '../state/vocabulary.actions';
import * as fromVocabularyReducer from '../state/vocabulary.reducer';
import { ListVocabularyComponent } from './list-vocabulary.component';

describe('ListVocabulariesComponent', () => {
    const testLessonList: Lesson[] = lessonTestData;
    const testLesson: Lesson = testLessonList[0];
    const testVocabularyList: Vocabulary[] = vocabularyTestData;

    let router: Router;

    let mockStore: MockStore<fromVocabularyReducer.State>;
    const loadedState = {
        lesson: {
            lessons: testLessonList,
            error: ''
        },
        lessonVocabulary: {
            vocabulary: testVocabularyList,
            error: ''
        }
    } as fromVocabularyReducer.State;

    let component: ListVocabularyComponent;
    let fixture: ComponentFixture<ListVocabularyComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [ListVocabularyComponent],
            imports: [
                RouterTestingModule.withRoutes(routes),
                TableModule,
                ButtonModule,
                SplitButtonModule,
                MenuModule,
            ],
            providers: [
                provideMockStore({ initialState: loadedState }),
                {
                    provide: ActivatedRoute,
                    useValue: {
                        snapshot: {
                            paramMap: convertToParamMap({
                                lessonID: testLesson.id
                            })
                        }
                    }
                },
            ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        router = TestBed.inject(Router);
        mockStore = TestBed.inject(MockStore);
        fixture = TestBed.createComponent(ListVocabularyComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    describe('component', () => {
        it('should create', () => {
            expect(component).toBeTruthy();
        });

        it('should dispatch a loadVocabulary action OnInit', () => {
            const initialState = {
                lesson: {
                    lessons: testLessonList,
                    error: ''
                },
                lessonVocabulary: {
                    vocabulary: [],
                    error: ''
                }
            } as fromVocabularyReducer.State;
            mockStore.setState(initialState);

            component.ngOnInit();

            const expected = cold('a', { a: fromVocabularyActions.loadVocabulary({ lessonID: testLesson.id }) });
            expect(mockStore.scannedActions$).toBeObservable(expected);
        });

        it('should contain lesson data after loading', () => {
            const expected = cold('a', { a: testLesson });
            expect(component.lesson$).toBeObservable(expected);
        });

        it('should contain vocabulary data after loading', () => {
            const expected = cold('a', { a: testVocabularyList });
            expect(component.vocabulary$).toBeObservable(expected);
        });

        it('should not have errors initially', () => {
            const initialState = {
                lesson: {
                    lessons: testLessonList,
                    error: ''
                },
                lessonVocabulary: {
                    vocabulary: [],
                    error: ''
                }
            } as fromVocabularyReducer.State;
            mockStore.setState(initialState);

            component.ngOnInit();

            const expected = cold('a', { a: '' });
            expect(component.errorMessage$).toBeObservable(expected);
        });

        it('should have errors when an action reported an error', () => {
            const errorState = {
                lesson: {
                    lessons: testLessonList,
                    error: ''
                },
                lessonVocabulary: {
                    vocabulary: [],
                    error: 'Error from action.'
                }
            } as fromVocabularyReducer.State;
            mockStore.setState(errorState);

            fixture.detectChanges();

            const expected = cold('a', { a: 'Error from action.' });
            expect(component.errorMessage$).toBeObservable(expected);
        });

        xit('should clear the state when closing the lesson', () => {
            component.closeLesson();

            const expected = cold('a', { a: fromVocabularyActions.clearState() });
            expect(mockStore.scannedActions$).toBeObservable(expected);
        });
    });

    describe('should render UI elements', () => {
        it('should have the required column heading', () => {
            const expectedColumns: ReadonlyArray<string> = [testLesson.language_a, testLesson.language_b, 'Level', 'Due Date', 'Actions'];
            const tableHeaders: NodeListOf<HTMLTableHeaderCellElement> = fixture.nativeElement.querySelectorAll('th');
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

        it('should display a vocabulary as defined in second test data entry', () => {
            const index = 1; // second element defined in testLessons
            const languageACell: HTMLTableCellElement = fixture.nativeElement.querySelector(`#list-vocabulary-language_a-${index}`);
            expect(languageACell.textContent).toContain(testVocabularyList[index].language_a, 'Language A is missing');
            const languageBCell: HTMLTableCellElement = fixture.nativeElement.querySelector(`#list-vocabulary-language_b-${index}`);
            expect(languageBCell.textContent).toContain(testVocabularyList[index].language_b, 'Language B is missing');
            const levelCell: HTMLTableCellElement = fixture.nativeElement.querySelector(`#list-vocabulary-level-${index}`);
            expect(levelCell.textContent).toContain(testVocabularyList[index].level.toString(), 'Level is missing');
            const dueDateCell: HTMLTableCellElement = fixture.nativeElement.querySelector(`#list-vocabulary-dueDate-${index}`);
            const dueDate: Date = new Date(testVocabularyList[index].dueDate);
            expect(dueDateCell.textContent).toContain(dueDate.toLocaleDateString('en-US', { year: '2-digit', month: 'numeric', day: 'numeric' }));
        });
    });

    describe('should have required actions', () => {
        it('should have required buttons', () => {
            const expectedActions: ReadonlyArray<string> = ['Create', 'Close Lesson', 'Edit'];
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
            const splitButtonComponent = fixture.debugElement.query(By.directive(SplitButtonComponent));
            const splitButtonComponentInstance: SplitButtonComponent = splitButtonComponent.injector.get(SplitButtonComponent);
            const expectedActions: ReadonlyArray<string> = ['Delete'];
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
        it('should navigate to add-vocabulary component when clicking "Create"', () => {
            spyOn(router, 'navigateByUrl').and.stub();

            component.createVocabulary();

            expect(router.navigateByUrl).toHaveBeenCalledWith(`/${frontend.lessons}/${component.lessonID}/${frontend.addVocabulary}`);
        });

        it('should navigate to list-lessons component when clicking "Close Lesson"', () => {
            spyOn(router, 'navigateByUrl').and.stub();

            component.closeLesson();

            expect(router.navigateByUrl).toHaveBeenCalledWith(`/${frontend.lessons}`);
        });

        it('should navigate edit-vocabulary component when clicking "Edit"', () => {
            spyOn(router, 'navigateByUrl').and.stub();

            component.updateVocabulary(testVocabularyList[0].id);

            expect(router.navigateByUrl).toHaveBeenCalledWith(`/${frontend.lessons}/${component.lessonID}/${frontend.editVocabulary}/${testVocabularyList[0].id}`);
        });

        it('should stay on list-vocabulary component when clicking "Delete"', () => {
            spyOn(router, 'navigateByUrl').and.stub();

            component.deleteVocabulary(testVocabularyList[0].id);

            expect(router.navigateByUrl).toHaveBeenCalledTimes(0);
        });
    });
});
