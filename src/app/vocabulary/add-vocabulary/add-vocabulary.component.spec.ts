import { ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { ActivatedRoute, convertToParamMap, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { ButtonModule, FormModule } from '@fundamental-ngx/core';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { routes } from 'src/app/app-routing.module';
import { Lesson } from 'src/app/models/lesson.model.';
import { Vocabulary } from 'src/app/models/vocabulary.model';
import { frontend } from 'src/app/resource.identifiers';
import { lessonTestData } from 'test/lesson.testdata.spec';
import { vocabularyTestData } from 'test/vocabulary.testdata.spec';
import * as fromVocabularyReducer from '../state/vocabulary.reducer';
import { AddVocabularyComponent } from './add-vocabulary.component';

describe('AddVocabulariesComponent', () => {
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

    let component: AddVocabularyComponent;
    let fixture: ComponentFixture<AddVocabularyComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [AddVocabularyComponent],
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
        fixture = TestBed.createComponent(AddVocabularyComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    describe('component', () => {
        it('should create', () => {
            expect(component).toBeTruthy();
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

        it('should have required (empty) input fields', () => {
            const languageAInput: any = fixture.debugElement.query(By.css('#add-vocabulary-language_a')).nativeElement;
            expect(languageAInput.value).toBe('');
            const languageBInput: any = fixture.debugElement.query(By.css('#add-vocabulary-language_b')).nativeElement;
            expect(languageBInput.value).toBe('');
        });

        describe('should have required actions', () => {
            it('should have button "Add"', () => {
                const button: HTMLButtonElement = fixture.nativeElement.querySelector('#add-vocabulary-addButton');
                expect(button.textContent).toContain('Add');
            });

            it('should have button "Cancel"', () => {
                const button: HTMLButtonElement = fixture.nativeElement.querySelector('#add-vocabulary-cancelButton');
                expect(button.textContent).toContain('Cancel');
            });
        });

        describe('should route correctly on actions', () => {
            it('should stay on add-vocabulary when clicking "Add"', () => {
                spyOn(router, 'navigateByUrl').and.stub();

                const addButton: HTMLButtonElement = fixture.nativeElement.querySelector('#add-vocabulary-addButton');
                addButton.click();

                expect(router.navigateByUrl).toHaveBeenCalledTimes(0);
            });

            it('should navigate to list-vocabulary component when clicking "Cancel"', () => {
                spyOn(router, 'navigateByUrl').and.stub();

                const cancelButton: HTMLButtonElement = fixture.nativeElement.querySelector('#add-vocabulary-cancelButton');
                cancelButton.click();

                expect(router.navigateByUrl).toHaveBeenCalledWith(`/${frontend.lessons}/${component.lessonID}/${frontend.vocabulary}`);
            });
        });
    });

    describe('should support keyboard navigation', () => {
        it('language_a should have autofocus', () => {
            const inputElement: HTMLInputElement = fixture.debugElement.query(By.css('#add-vocabulary-language_a')).nativeElement;
            expect(inputElement.autofocus).toBeTrue();
        });

        it('should have focus on add-vocabulary-language_a field after clicking "Add"', fakeAsync(() => {
            const inputElement: HTMLLinkElement = fixture.debugElement.query(By.css('#add-vocabulary-language_a')).nativeElement;
            spyOn(inputElement, 'focus');

            const addButton: HTMLButtonElement = fixture.nativeElement.querySelector('#add-vocabulary-addButton');
            addButton.click();
            tick();

            expect(inputElement.focus).toHaveBeenCalled();
        }));

        it('should only have one autofocus element', () => {
            const items: ReadonlyArray<HTMLElement> = fixture.nativeElement.getElementsByTagName('*');
            let counter = 0;
            for (let i = items.length; i--;) {
                if (items[i].autofocus === true) { counter++; }
            }
            expect(counter).toEqual(1);
        });
    });
});
