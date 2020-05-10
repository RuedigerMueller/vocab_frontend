import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListVocabularyComponent } from './list-vocabulary.component';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClient } from '@angular/common/http';
import { VocabularyService } from '../vocabulary.service';
import { LessonService } from 'src/app/lesson/lesson.service';
import { of } from 'rxjs';
import { lessonTestData } from 'test/lesson.testdata.spec';
import { vocabularyTestData } from 'test/vocabulary.testdata.spec';

const testLesson = lessonTestData[0];
const testVocabularyist = vocabularyTestData;

describe('ListVocabulariesComponent', () => {
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;

  let component: ListVocabularyComponent;
  let fixture: ComponentFixture<ListVocabularyComponent>;

  let getVocabularySpy;
  let getLessonsSpy;

  beforeEach(async(() => {
    const vocabularyService = jasmine.createSpyObj('VocabularyService', ['getLessonVocabulary']);
    getVocabularySpy = vocabularyService.getLessonVocabulary.and.returnValue(of(testVocabularyist));

    const lessonService = jasmine.createSpyObj('LessonService', ['getLesson']);
    getLessonsSpy = lessonService.getLesson.and.returnValue(of(testLesson));

    TestBed.configureTestingModule({
      declarations: [ListVocabularyComponent],
      imports: [
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
    fixture = TestBed.createComponent(ListVocabularyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('Test environment should be setup', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });
  });

  describe('UI elements should be displayed', () => {
    it('should have the required column heading', () => {

    });

    it('should have required actions', () => {

    });

    describe('should display the content', () => {

    });
  });

  describe('Routing tests', () => {
    it('should navigate to add-vocabulary component when clicking "Create"', () => {

    });

    it('should navigate edit-vocabulary component when clicking "Edit"', () => {

    });

    it('should stay on list-vocabulary component when clicking "Delete"', () => {

    });
  });
});
