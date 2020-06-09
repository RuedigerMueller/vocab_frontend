import { Location } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { DebugElement } from '@angular/core';
import { async, ComponentFixture, TestBed, tick, fakeAsync } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { ActivatedRoute, convertToParamMap, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { ButtonModule, FormModule, LayoutGridModule, PanelModule } from '@fundamental-ngx/core';
import { of } from 'rxjs/internal/observable/of';
import { routes } from 'src/app/app-routing.module';
import { Lesson } from 'src/app/models/lesson.model.';
import { LessonService } from 'src/app/services/lesson.service';
import { lessonTestData } from 'test/lesson.testdata.spec';
import { vocabularyTestData } from 'test/vocabulary.testdata.spec';
import { Vocabulary } from '../../models/vocabulary.model';
import { VocabularyService } from '../../services/vocabulary.service';
import { QuizComponent } from './quiz.component';
import { frontend } from 'src/app/resource.identifiers';
import { AuthGuardService } from 'src/app/helpers/auth-guard.service';

describe('QuizComponent', () => {
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;
  let location: Location;
  let router: Router;

  let component: QuizComponent;
  let fixture: ComponentFixture<QuizComponent>;

  let getDueLessonVocabularySpy: any;
  let vocabularyKnownSpy: any;
  let vocabularyUnknownSpy: any;
  let getLessonsSpy: any;
  let authGuardSpy: any;

  const testLesson: Lesson = lessonTestData[0];
  const testVocabularyList: ReadonlyArray<Vocabulary> = vocabularyTestData;

  beforeEach(async(() => {
    const vocabularyService: any = jasmine.createSpyObj('VocabularyService', ['getDueLessonVocabulary', 'vocabularyKnown', 'vocabularyUnknown']);
    getDueLessonVocabularySpy = vocabularyService.getDueLessonVocabulary.and.returnValue(of(testVocabularyList));
    vocabularyKnownSpy = vocabularyService.vocabularyKnown.and.returnValue(of());
    vocabularyUnknownSpy = vocabularyService.vocabularyUnknown.and.returnValue(of());

    const lessonService: any = jasmine.createSpyObj('LessonService', ['getLesson']);
    getLessonsSpy = lessonService.getLesson.and.returnValue(of(testLesson));

    const authGuardService: any = jasmine.createSpyObj('AuthGuardService', ['canActivate', 'deleteVocabulary']);
    authGuardSpy = authGuardService.deleteVocabulary.and.returnValue(true);

    TestBed.configureTestingModule({
      declarations: [QuizComponent],
      imports: [
        HttpClientTestingModule,
        RouterTestingModule.withRoutes(routes),
        LayoutGridModule,
        PanelModule,
        ButtonModule,
        FormsModule,
        FormModule,
      ],
      providers: [
        { provide: VocabularyService, useValue: vocabularyService },
        { provide: LessonService, useValue: lessonService },
        { provide: AuthGuardService, useValue: authGuardService },
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

    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
  }));

  beforeEach(() => {
    router = TestBed.inject(Router);
    location = TestBed.inject(Location);
    fixture = TestBed.createComponent(QuizComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  describe('should render UI elements', () => {
    it('should have the required labels', () => {
      let success = true;

      const expectedLabels: ReadonlyArray<string> = [testLesson.language_a, testLesson.language_b, 'Correct Response'];
      const labels: NodeListOf<HTMLLabelElement> = fixture.nativeElement.querySelectorAll('label');

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
      let success = true;

      const expectedTextAreas: ReadonlyArray<string> = ['quiz-knownLanguage', 'quiz-learnedLanguage', 'quiz-correctResponse'];
      const textAreas: NodeListOf<HTMLTextAreaElement> = fixture.nativeElement.querySelectorAll('textarea');

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
      expect(component.questionedVocabulary).toEqual(1);
      expect(component.numberDueVocabularies).toEqual(testVocabularyList.length)
    });

    xit('should display an error message when the quiz was started without due vocabulary', () => {

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
      expect(knownLanguageTextArea.textContent).toEqual(component.dueVocabulary[0].language_a);
      expect(learnedLanguageTextArea.textContent).toEqual('');
      expect(correctResponseTextArea.textContent).toEqual('');
    });

    it('should display the correct elements for correct answers', () => {
      component.enteredResponse = component.vocabulary.language_b;
      component.checkResponse();
      expect(component.entryFieldState).toEqual('success');
      expect(component.displayCheckResponseButton).toBeFalse();
      expect(component.displayValidateResponseButton).toBeFalse();
      expect(component.displayInvalidateResponseButton).toBeFalse();
      expect(component.displayNextButton).toBeTrue();
      expect(component.nextButtonType).toEqual('positive');
    });

    it('should display the correct elements for incorrect answers', () => {
      component.enteredResponse = 'incorrect response';
      component.checkResponse();
      expect(component.entryFieldState).toEqual('error');
      expect(component.displayCheckResponseButton).toBeFalse();
      expect(component.displayValidateResponseButton).toBeTrue();
      expect(component.displayInvalidateResponseButton).toBeFalse();
      expect(component.displayNextButton).toBeTrue();
      expect(component.nextButtonType).toEqual('');
    });

    it('should display the correct elements for corected incorrect answers', () => {
      component.validResponse();
      expect(component.entryFieldState).toEqual('success');
      expect(component.displayCheckResponseButton).toBeFalse();
      expect(component.displayValidateResponseButton).toBeFalse();
      expect(component.displayInvalidateResponseButton).toBeTrue();
      expect(component.displayNextButton).toBeTrue();
      expect(component.nextButtonType).toEqual('');
    });

    it('should display the correct elements for invalided corrected answers', () => {
      component.invalidResponse();
      expect(component.entryFieldState).toEqual('error');
      expect(component.displayCheckResponseButton).toBeFalse();
      expect(component.displayValidateResponseButton).toBeTrue();
      expect(component.displayInvalidateResponseButton).toBeFalse();
      expect(component.displayNextButton).toBeTrue();
      expect(component.nextButtonType).toEqual('');
    });

    it('should display the correct elements after clicking next', () => {
      const currentCount: number = component.questionedVocabulary;
      component.next();
      expect(component.correctResponse).toEqual('', 'correctResponse should be empty');
      expect(component.entryFieldState).toEqual('', 'entryFieldState should be empty');
      expect(component.displayCheckResponseButton).toBeTrue();
      expect(component.displayValidateResponseButton).toBeFalse();
      expect(component.displayInvalidateResponseButton).toBeFalse();
      expect(component.displayNextButton).toBeFalse();
      expect(component.nextButtonType).toEqual('', 'nextButtonType should be empty');
      expect(component.enteredResponse).toEqual('', 'enteredResponse should be empty');
      expect(currentCount + 1).toEqual(component.questionedVocabulary, 'counter should have increased');
      // index starts with 0, count with 1
      expect(component.vocabulary).toEqual(component.dueVocabulary[currentCount], 'next vocabulary should should have been pulled');
    });
  });

  describe('backend updates', () => {
    it('should correctly update the backend when the vocabulary was known', () => {
      component.entryFieldState = 'success';
      component.next();
      expect(vocabularyKnownSpy).toHaveBeenCalled();
    });

    it('should correctly update the backend when the vocabulary was unknwon', () => {
      component.entryFieldState = 'error';
      component.next();
      expect(vocabularyUnknownSpy).toHaveBeenCalled();
    });
  })

  describe('should route correctly on actions', () => {
    xit('should return to the list-lessons component when closing the quiz', fakeAsync(() => {
      const cancelButton: HTMLButtonElement = fixture.nativeElement.querySelector('#quiz-cancel');
      cancelButton.click();
      tick();

      expect(location.path()).toBe(`/${frontend.lessons}`, 'should nav to lessons');
    }));

    xit('should return to the list-lessons component at the end of the quiz', () => {
      component.questionedVocabulary = component.numberDueVocabularies;
      component.next();
      expect(location.path()).toBe(`/${frontend.lessons}`, 'should nav to lessons');
    });

    xit('should stay on the quiz for all other acions', () => {

    });

  });

  describe('should support keyboard navigation', () => {
    it('learned language should have autofocus', () => {
      const inputDE: DebugElement = fixture.debugElement.query(By.css('#quiz-learnedLanguage'));
      const inputElement: HTMLInputElement = inputDE.nativeElement;
      expect(inputElement.autofocus).toBeTrue();
    });

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
