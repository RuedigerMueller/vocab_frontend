import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditVocabularyComponent } from './edit-vocabulary.component';
import { HttpClient } from '@angular/common/http';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { lessonTestData } from 'test/lesson.testdata.spec';
import { of } from 'rxjs';
import { LessonService } from 'src/app/lesson/lesson.service';
import { vocabularyTestData } from 'test/vocabulary.testdata.spec';
import { VocabularyService } from '../vocabulary.service';
import { By } from '@angular/platform-browser';

const testLesson = lessonTestData[0];
const testVocabularyList = vocabularyTestData;

describe('EditVocabularyComponent', () => {
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;

  let component: EditVocabularyComponent;
  let fixture: ComponentFixture<EditVocabularyComponent>;

  let getVocabularySpy;
  let getLessonsSpy;

  beforeEach(async(() => {
    const vocabularyService = jasmine.createSpyObj('VocabularyService', ['getVocabulary']);
    getVocabularySpy = vocabularyService.getVocabulary.and.returnValue(of(testVocabularyList[0]));

    const lessonService = jasmine.createSpyObj('LessonService', ['getLesson']);
    getLessonsSpy = lessonService.getLesson.and.returnValue(of(testLesson));

    TestBed.configureTestingModule({
      declarations: [EditVocabularyComponent],
      imports: [
        ReactiveFormsModule,
        HttpClientTestingModule,
        RouterTestingModule.withRoutes([]),
      ],
      providers: [
        { provide: VocabularyService, useValue: vocabularyService },
        { provide: LessonService, useValue: lessonService },
      ]
    })
      .compileComponents();

    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditVocabularyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have the required labels', () => {
    let success = true;

    const expectedLabels = [testLesson.language_a, testLesson.language_b];

    const appElement: HTMLElement = fixture.nativeElement;
    const labels = appElement.querySelectorAll('label');

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

  describe('should have the required fields filled', () => {
    it('should have "Learned Language" input field filled', () => {
      const input = fixture.debugElement.query(By.css('#edit-vocabulary-language_a'));
      const inputElement = input.nativeElement;
      expect(inputElement.value).toContain(testVocabularyList[0].language_a);
      expect(getVocabularySpy.calls.any()).toBe(true, 'getVocabulary called');
    });

    it('should have "Known Language" input field filled', () => {
      const input = fixture.debugElement.query(By.css('#edit-vocabulary-language_b'));
      const inputElement = input.nativeElement;
      expect(inputElement.value).toContain(testVocabularyList[0].language_b);
      expect(getVocabularySpy.calls.any()).toBe(true, 'getVocabulary called');
    });
  });

  describe('should have the expected actions', () => {
    it('should have button "Save"', () => {
      const appElement: HTMLElement = fixture.nativeElement;
      const button = appElement.querySelector('#edit-vocabulary-saveButton');
      expect(button.textContent).toContain('Save');
    });

    it('should have button "Cancel"', () => {
      const appElement: HTMLElement = fixture.nativeElement;
      const button = appElement.querySelector('#edit-vocabulary-cancelButton');
      expect(button.textContent).toContain('Cancel');
    });
  });
});
