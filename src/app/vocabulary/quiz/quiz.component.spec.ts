import { ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { ActivatedRoute, convertToParamMap, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { ButtonComponent, ButtonModule, DialogModule, FormModule, LayoutGridModule, LayoutPanelModule, MessageStripModule, TitleModule } from '@fundamental-ngx/core';
import { FormStates } from '@fundamental-ngx/core/lib/form/form-control/form-states';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { cold } from 'jasmine-marbles';
import { routes } from 'src/app/app-routing.module';
import { Lesson } from 'src/app/models/lesson.model.';
import { Vocabulary } from 'src/app/models/vocabulary.model';
import { frontend } from 'src/app/resource.identifiers';
import { lessonTestData } from 'test/lesson.testdata.spec';
import { vocabularyTestData } from 'test/vocabulary.testdata.spec';
import { QuizComponent } from './quiz.component';
import * as QuizActions from './state/quiz.actions';
import { QuizUIElementState, State } from './state/quiz.reducer';


describe('QuizComponent', () => {
    const testLessonList: Lesson[] = lessonTestData;
    const testLesson: Lesson = testLessonList[0];
    const testVocabularyList: Vocabulary[] = vocabularyTestData;

    const initialUIElementState: QuizUIElementState = {
        entryFieldState: '',
        displayCheckResponseButton: true,
        displayValidateResponseButton: false,
        displayInvalidateResponseButton: false,
        displayNextButton: false,
        nextButtonType: '',
        correctResponse: '',
    };

    const initialState = {
        lesson: {
            lessons: testLessonList,
            error: ''
        },
        quiz: {
            vocabulary: [],
            questionedVocabulary: 0,
            numberKnownVocabularies: 0,
            numberUnknownVocabularies: 0,
            currentVocabulary: {} as Vocabulary,
            continueQuiz: true,
            UIElementState: initialUIElementState,
            error: ''
        }
    } as State;

    const loadedState = {
        lesson: {
            lessons: testLessonList,
            error: ''
        },
        quiz: {
            vocabulary: testVocabularyList,
            questionedVocabulary: 1,
            numberKnownVocabularies: 0,
            numberUnknownVocabularies: 0,
            currentVocabulary: testVocabularyList[0],
            continueQuiz: true,
            UIElementState: initialUIElementState,
            error: ''
        }
    } as State;

    let router: Router;

    let mockStore: MockStore<State>;

    let component: QuizComponent;
    let fixture: ComponentFixture<QuizComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [QuizComponent],
            imports: [
                RouterTestingModule.withRoutes(routes),
                LayoutGridModule,
                LayoutPanelModule,
                ButtonModule,
                FormsModule,
                FormModule,
                MessageStripModule,
                DialogModule,
                TitleModule,
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
        fixture = TestBed.createComponent(QuizComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    describe('component', () => {
        it('should create', () => {
            expect(component).toBeTruthy();
        });

        it('should dispatch a quiz action OnInit', () => {
            mockStore.setState(initialState);

            component.ngOnInit();

            const expected = cold('a', { a: QuizActions.loadQuiz({ lessonID: testLesson.id }) });
            expect(mockStore.scannedActions$).toBeObservable(expected);
        });

        it('should contain lesson data after loading', () => {
            const expected = cold('a', { a: testLesson });
            expect(component.lesson$).toBeObservable(expected);
        });

        it('should contain numberDueVocabularies data after loading', () => {
            const expected = cold('a', { a: testVocabularyList.length });
            expect(component.numberDueVocabularies$).toBeObservable(expected);
        });

        it('should contain questionedVocabulary data after loading', () => {
            const expected = cold('a', { a: 1 });
            expect(component.questionedVocabulary$).toBeObservable(expected);
        });

        it('should contain numberKnownVocabularies data after loading', () => {
            const expected = cold('a', { a: 0 });
            expect(component.numberKnownVocabularies$).toBeObservable(expected);
        });

        it('should contain numberUnknownVocabularies data after loading', () => {
            const expected = cold('a', { a: 0 });
            expect(component.numberUnknownVocabularies$).toBeObservable(expected);
        });

        it('should contain currentVocabulary data after loading', () => {
            const expected = cold('a', { a: testVocabularyList[0] });
            expect(component.currentVocabulary$).toBeObservable(expected);
        });

        it('should contain UIElementState data after loading', () => {
            const expected = cold('a', { a: initialUIElementState });
            expect(component.UIElementState$).toBeObservable(expected);
        });

        it('should contain continueQuiz data after loading', () => {
            const expected = cold('a', { a: true });
            expect(component.continueQuiz$).toBeObservable(expected);
        });

        it('should not have errors initially', () => {
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
                quiz: {
                    vocabulary: [],
                    questionedVocabulary: 0,
                    numberKnownVocabularies: 0,
                    numberUnknownVocabularies: 0,
                    currentVocabulary: {} as Vocabulary,
                    continueQuiz: true,
                    UIElementState: initialUIElementState,
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
        it('should have the required labels', () => {
            const expectedLabels: ReadonlyArray<string> = [testLesson.language_a, testLesson.language_b, 'Correct Response'];
            const labels: NodeListOf<HTMLLabelElement> = fixture.nativeElement.querySelectorAll('label');
            let success = true;
            for (const expectedLabel of expectedLabels) {
                let found = false;
                labels.forEach((label: HTMLLabelElement) => {
                    if (label.textContent === expectedLabel) {
                        found = true;
                    }
                });

                if (found === false) {
                    success = false;
                    expect(found).toBeTruthy(`Label ${expectedLabel} not found`);
                }
            }
            expect(success).toBeTruthy('All expected labeles rendered');
        });

        it('should have the required text areas', () => {
            const expectedTextAreas: ReadonlyArray<string> = ['quiz-knownLanguage', 'quiz-learnedLanguage', 'quiz-correctResponse'];
            const textAreas: NodeListOf<HTMLTextAreaElement> = fixture.nativeElement.querySelectorAll('textarea');
            let success = true;
            for (const expectedTextArea of expectedTextAreas) {
                let found = false;
                textAreas.forEach((textArea: HTMLTextAreaElement) => {
                    if (textArea.id === expectedTextArea) {
                        found = true;
                    }
                });

                if (found === false) {
                    success = false;
                    expect(found).toBeTruthy(`Textarea ID ${expectedTextArea} not found`);
                }
            }
            expect(success).toBeTruthy('All expected labeles rendered');
        });

        it('should have the known language text ara filled and the others empty', () => {
            let success = true;
            const textAreas: NodeListOf<HTMLTextAreaElement> = fixture.nativeElement.querySelectorAll('textarea');

            textAreas.forEach((textArea: HTMLTextAreaElement) => {
                switch (textArea.id) {
                    case 'quiz-knownLanguage':
                        if (textArea.textContent === '') { success = false; }
                        expect(textArea.textContent).toBeTruthy(`${textArea.id} should be filled`);
                        break;
                    default:
                        if (textArea.textContent !== '') { success = false; }
                        expect(textArea.textContent).toBeFalsy(`${textArea.id} should be empty`);
                        break;
                }
            });
            expect(success).toBeTruthy('All expected labeles rendered');
        });

        it('should display the progress', () => {
            const progressParagraph: HTMLParagraphElement = fixture.nativeElement.querySelector(`#quiz-progress`);
            expect(progressParagraph).toBeDefined();
            expect(progressParagraph.textContent.trim()).toBe(`1/${testVocabularyList.length}`);
        });
    });

    // text areas and labels are fix
    // only need to check buttons, button/textarea colors and content of correct response text area
    describe('should hide/show & focus content depending on the response', () => {
        it('should display the correct elements initially', () => {
            const checkResponseButton: HTMLButtonElement = fixture.nativeElement.querySelector(`#quiz-checkResponse`);
            const validResponseButton: HTMLButtonElement = fixture.nativeElement.querySelector(`#quiz-validResponse`);
            const invalidResponseButton: HTMLButtonElement = fixture.nativeElement.querySelector(`#quiz-invalidResponse`);
            const nextButton: HTMLButtonElement = fixture.nativeElement.querySelector(`#quiz-next`);
            const knownLanguageTextArea: HTMLTextAreaElement = fixture.nativeElement.querySelector(`#quiz-knownLanguage`);
            const learnedLanguageTextArea: HTMLTextAreaElement = fixture.nativeElement.querySelector(`#quiz-learnedLanguage`);
            const correctResponseTextArea: HTMLTextAreaElement = fixture.nativeElement.querySelector(`#quiz-correctResponse`);

            expect(checkResponseButton).toBeDefined();
            expect(validResponseButton).toBeFalsy();
            expect(invalidResponseButton).toBeFalsy();
            expect(nextButton).toBeFalsy();
            expect(knownLanguageTextArea.textContent).toEqual(testVocabularyList[0].language_a);
            expect(learnedLanguageTextArea.textContent).toEqual('');
            expect(correctResponseTextArea.textContent).toEqual('');
        });

        it('should display the correct elements for correct answers', () => {
            const newState = {
                ...loadedState,
                quiz: {
                    ...loadedState.quiz,
                    UIElementState: {
                        entryFieldState: 'success',
                        displayCheckResponseButton: false,
                        displayValidateResponseButton: false,
                        displayInvalidateResponseButton: false,
                        displayNextButton: true,
                        nextButtonType: 'positive',
                        correctResponse: '',
                    }
                }
            } as State;
            mockStore.setState(newState);

            fixture.detectChanges();

            const learnedLanguageTextArea: HTMLTextAreaElement = fixture.nativeElement.querySelector(`#quiz-learnedLanguage`);
            const checkResponseButton: HTMLButtonElement = fixture.nativeElement.querySelector(`#quiz-checkResponse`);
            const validResponseButton: HTMLButtonElement = fixture.nativeElement.querySelector(`#quiz-validResponse`);
            const invalidResponseButton: HTMLButtonElement = fixture.nativeElement.querySelector(`#quiz-invalidResponse`);
            const nextButton: HTMLButtonElement = fixture.nativeElement.querySelector(`#quiz-next`);
            expect(learnedLanguageTextArea.className).toContain('is-success');
            expect(checkResponseButton).toBeNull();
            expect(validResponseButton).toBeNull();
            expect(invalidResponseButton).toBeNull();
            expect(nextButton).not.toBeNull();
            expect(nextButton.className).toContain('positive');
        });

        it('should display the correct elements for incorrect answers', () => {
            const newState = {
                ...loadedState,
                quiz: {
                    ...loadedState.quiz,
                    UIElementState: {
                        entryFieldState: 'error',
                        displayCheckResponseButton: false,
                        displayValidateResponseButton: true,
                        displayInvalidateResponseButton: false,
                        displayNextButton: true,
                        nextButtonType: '',
                        correctResponse: '',
                    }
                }
            } as State;
            mockStore.setState(newState);

            fixture.detectChanges();

            const learnedLanguageTextArea: HTMLTextAreaElement = fixture.nativeElement.querySelector(`#quiz-learnedLanguage`);
            const checkResponseButton: HTMLButtonElement = fixture.nativeElement.querySelector(`#quiz-checkResponse`);
            const validResponseButton: HTMLButtonElement = fixture.nativeElement.querySelector(`#quiz-validResponse`);
            const invalidResponseButton: HTMLButtonElement = fixture.nativeElement.querySelector(`#quiz-invalidResponse`);
            const nextButton: HTMLButtonElement = fixture.nativeElement.querySelector(`#quiz-next`);
            expect(learnedLanguageTextArea.className).toContain('is-error');
            expect(checkResponseButton).toBeNull();
            expect(validResponseButton).not.toBeNull();
            expect(invalidResponseButton).toBeNull();
            expect(nextButton).not.toBeNull();
            expect(nextButton.className).toBe('fd-button');
        });

        it('should display the correct elements for corected incorrect answers', () => {
            const newState = {
                ...loadedState,
                quiz: {
                    ...loadedState.quiz,
                    UIElementState: {
                        entryFieldState: 'success',
                        displayCheckResponseButton: false,
                        displayValidateResponseButton: false,
                        displayInvalidateResponseButton: true,
                        displayNextButton: true,
                        nextButtonType: '',
                        correctResponse: '',
                    }
                }
            } as State;
            mockStore.setState(newState);

            fixture.detectChanges();

            const learnedLanguageTextArea: HTMLTextAreaElement = fixture.nativeElement.querySelector(`#quiz-learnedLanguage`);
            const checkResponseButton: HTMLButtonElement = fixture.nativeElement.querySelector(`#quiz-checkResponse`);
            const validResponseButton: HTMLButtonElement = fixture.nativeElement.querySelector(`#quiz-validResponse`);
            const invalidResponseButton: HTMLButtonElement = fixture.nativeElement.querySelector(`#quiz-invalidResponse`);
            const nextButton: HTMLButtonElement = fixture.nativeElement.querySelector(`#quiz-next`);
            expect(learnedLanguageTextArea.className).toContain('is-success');
            expect(checkResponseButton).toBeNull();
            expect(validResponseButton).toBeNull();
            expect(invalidResponseButton).not.toBeNull();
            expect(nextButton).not.toBeNull();
            expect(nextButton.className).toBe('fd-button');
        });

        it('should display the correct elements for invalided corrected answers', () => {
            const newState = {
                ...loadedState,
                quiz: {
                    ...loadedState.quiz,
                    UIElementState: {
                        entryFieldState: 'error',
                        displayCheckResponseButton: false,
                        displayValidateResponseButton: true,
                        displayInvalidateResponseButton: false,
                        displayNextButton: true,
                        nextButtonType: '',
                        correctResponse: '',
                    }
                }
            } as State;
            mockStore.setState(newState);

            fixture.detectChanges();

            const learnedLanguageTextArea: HTMLTextAreaElement = fixture.nativeElement.querySelector(`#quiz-learnedLanguage`);
            const checkResponseButton: HTMLButtonElement = fixture.nativeElement.querySelector(`#quiz-checkResponse`);
            const validResponseButton: HTMLButtonElement = fixture.nativeElement.querySelector(`#quiz-validResponse`);
            const invalidResponseButton: HTMLButtonElement = fixture.nativeElement.querySelector(`#quiz-invalidResponse`);
            const nextButton: HTMLButtonElement = fixture.nativeElement.querySelector(`#quiz-next`);
            expect(learnedLanguageTextArea.className).toContain('is-error');
            expect(checkResponseButton).toBeNull();
            expect(validResponseButton).not.toBeNull();
            expect(invalidResponseButton).toBeNull();
            expect(nextButton).not.toBeNull();
            expect(nextButton.className).toBe('fd-button');
        });

        it('should display the correct elements after clicking next', () => {
            const newState = {
                ...loadedState,
                quiz: {
                    ...loadedState.quiz,
                    UIElementState: {
                        entryFieldState: '',
                        displayCheckResponseButton: true,
                        displayValidateResponseButton: false,
                        displayInvalidateResponseButton: false,
                        displayNextButton: false,
                        nextButtonType: '',
                        correctResponse: '',
                    }
                }
            } as State;
            mockStore.setState(newState);

            fixture.detectChanges();

            const correctResponseTextArea: HTMLTextAreaElement = fixture.nativeElement.querySelector(`#quiz-correctResponse`);
            const learnedLanguageTextArea: HTMLTextAreaElement = fixture.nativeElement.querySelector(`#quiz-learnedLanguage`);
            const checkResponseButton: HTMLButtonElement = fixture.nativeElement.querySelector(`#quiz-checkResponse`);
            const validResponseButton: HTMLButtonElement = fixture.nativeElement.querySelector(`#quiz-validResponse`);
            const invalidResponseButton: HTMLButtonElement = fixture.nativeElement.querySelector(`#quiz-invalidResponse`);
            const nextButton: HTMLButtonElement = fixture.nativeElement.querySelector(`#quiz-next`);
            expect(correctResponseTextArea.textContent).toEqual('');
            expect(learnedLanguageTextArea.className).toContain('ng-valid');
            expect(learnedLanguageTextArea.textContent).toEqual('');
            expect(checkResponseButton).not.toBeNull();
            expect(validResponseButton).toBeNull();
            expect(invalidResponseButton).toBeNull();
            expect(nextButton).toBeNull();
        });
    });

    describe('should route correctly on actions', () => {
        it('should return to the list-lessons component at the end of the quiz', () => {
            spyOn(router, 'navigateByUrl').and.stub();
            const quizEndState = {
                lesson: {
                    lessons: testLessonList,
                    error: ''
                },
                quiz: {
                    vocabulary: testVocabularyList,
                    questionedVocabulary: 0,
                    numberKnownVocabularies: 0,
                    numberUnknownVocabularies: 0,
                    currentVocabulary: {} as Vocabulary,
                    continueQuiz: false,
                    UIElementState: initialUIElementState,
                    error: ''
                }
            } as State;
            mockStore.setState(quizEndState);

            fixture.detectChanges();

            expect(router.navigateByUrl).toHaveBeenCalledWith(`/${frontend.lessons}`);
        });

        it('should stay on the quiz for all other acions', () => {
            spyOn(router, 'navigateByUrl').and.stub();

            component.checkResponse();
            fixture.detectChanges();
            expect(router.navigateByUrl).toHaveBeenCalledTimes(0);

            component.validResponse();
            fixture.detectChanges();
            expect(router.navigateByUrl).toHaveBeenCalledTimes(0);

            component.invalidResponse();
            fixture.detectChanges();
            expect(router.navigateByUrl).toHaveBeenCalledTimes(0);
        });
    });
});
