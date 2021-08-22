import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { ActivatedRoute, convertToParamMap, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { ButtonModule, FormModule } from '@fundamental-ngx/core';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { cold } from 'jasmine-marbles';
import { routes } from 'src/app/app-routing.module';
import { Lesson } from 'src/app/models/lesson.model.';
import { Vocabulary } from 'src/app/models/vocabulary.model';
import { frontend } from 'src/app/resource.identifiers';
import { lessonTestData } from 'test/lesson.testdata.spec';
import { vocabularyTestData } from 'test/vocabulary.testdata.spec';
import * as fromVocabularyReducer from '../state/vocabulary.reducer';
import { EditVocabularyComponent } from './edit-vocabulary.component';

describe('EditVocabulariesComponent', () => {
    const testLessonList: Lesson[] = lessonTestData;
    const testLesson: Lesson = testLessonList[0];
    const testVocabularyList: Vocabulary[] = vocabularyTestData;
    const testVocabulary: Vocabulary = testVocabularyList[0];

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

    let component: EditVocabularyComponent;
    let fixture: ComponentFixture<EditVocabularyComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [EditVocabularyComponent],
            imports: [
                RouterTestingModule.withRoutes(routes),
                ReactiveFormsModule,
                ButtonModule,
                FormModule,
            ],
            providers: [
                provideMockStore({ initialState: loadedState }),
                {
                    provide: ActivatedRoute,
                    useValue: {
                        snapshot: {
                            paramMap: convertToParamMap({
                                lessonID: testLesson.id,
                                vocabularyID: testVocabulary.id
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
        fixture = TestBed.createComponent(EditVocabularyComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    describe('component', () => {
        it('should create', () => {
            expect(component).toBeTruthy();
        });

        it('should contain vocabulary data after loading', () => {
            const expected = cold('a', { a: testVocabulary });
            expect(component.vocabulary$).toBeObservable(expected);
        });
    });

    describe('should render UI elements', () => {
        it('should have the required labels', () => {
            const expectedLabels: ReadonlyArray<string> = [testLesson.language_a, testLesson.language_b];
            const labels: NodeListOf<HTMLLabelElement> = fixture.nativeElement.querySelectorAll('label');
            let success = true;
            for (const expectedLabel of expectedLabels) {
                let found = false;
                labels.forEach((label) => {
                    if (label.textContent === expectedLabel) {
                        found = true;
                    }
                });

                if (found === false) {
                    success = false;
                    expect(found).toBeTruthy(`Label ${expectedLabel} not found`);
                }
            }
            expect(success).toBeTruthy('All expected labels rendered');
        });

        it('should have required input field filled', () => {
            const languageAInput: any = fixture.debugElement.query(By.css('#edit-vocabulary-language_a')).nativeElement;
            expect(languageAInput.value).toContain(testVocabularyList[0].language_a, 'Language A is missing');
            const languageBInput: any = fixture.debugElement.query(By.css('#edit-vocabulary-language_b')).nativeElement;
            expect(languageBInput.value).toContain(testVocabularyList[0].language_b);
        });
    });

    describe('should have required actions', () => {
        it('should have button "Save"', () => {
            const button: HTMLButtonElement = fixture.nativeElement.querySelector('#edit-vocabulary-saveButton');
            expect(button.textContent).toContain('Save');
        });

        it('should have button "Cancel"', () => {
            const button: HTMLButtonElement = fixture.nativeElement.querySelector('#edit-vocabulary-cancelButton');
            expect(button.textContent).toContain('Cancel');
        });
    });

    describe('should route correctly on actions', () => {
        it('should navigate to list-lessons component when clicking "Save"', () => {
            spyOn(router, 'navigateByUrl').and.stub();

            const saveButton: HTMLButtonElement = fixture.nativeElement.querySelector('#edit-vocabulary-saveButton');
            saveButton.click();

            expect(router.navigateByUrl).toHaveBeenCalledWith(`/${frontend.lessons}/${component.lessonID}/${frontend.vocabulary}`);

        });

        it('should navigate to list-lessons component when clicking "Cancel"', () => {
            spyOn(router, 'navigateByUrl').and.stub();

            const cancelButton: HTMLButtonElement = fixture.nativeElement.querySelector('#edit-vocabulary-cancelButton');
            cancelButton.click();

            expect(router.navigateByUrl).toHaveBeenCalledWith(`/${frontend.lessons}/${component.lessonID}/${frontend.vocabulary}`);

        });
    });

    describe('should support keyboard navigation', () => {
        it('languaga_a should have autofocus', () => {
            const inputElement: HTMLInputElement = fixture.debugElement.query(By.css('#edit-vocabulary-language_a')).nativeElement;
            expect(inputElement.autofocus).toBeTrue();
        });
    });
});
