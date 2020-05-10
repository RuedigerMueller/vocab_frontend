import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListVocabularyComponent } from './list-vocabulary.component';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClient } from '@angular/common/http';
import { VocabularyService } from '../vocabulary.service';
import { LessonService } from 'src/app/lesson/lesson.service';
import { of } from 'rxjs';

const testLesson = {
  id: 5,
  user: 'User1',
  title: 'Unidad 1',
  language_a: 'Español',
  language_b: 'Deutsch',
  vocabularies: [],
  numberVocables: 0,
  numberDueVocables: 0
};

const testVocabularyist = [
  {
    language_a: 'house',
    language_b: 'Haus',
    level: 1,
    dueDate: Date(),
  },
  {
    language_a: 'mouse',
    language_b: 'Maus',
    level: 2,
    dueDate: Date(),
  },
  {
    language_a: 'school',
    language_b: 'Schule',
    level: 1,
    dueDate: Date(),
  },
];

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
      declarations: [ ListVocabularyComponent ],
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

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
