import { Location } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { FormModule, ButtonModule, LayoutGridModule, PanelModule } from '@fundamental-ngx/core';
import { of } from 'rxjs/internal/observable/of';
import { routes } from 'src/app/app-routing.module';
import { Lesson } from 'src/app/models/lesson.model.';
import { lessonTestData } from 'test/lesson.testdata.spec';
import { vocabularyTestData } from 'test/vocabulary.testdata.spec';
import { VocabularyService } from '../../services/vocabulary.service';
import { Vocabulary } from '../../models/vocabulary.model';
import { QuizComponent } from './quiz.component';
import { LessonService } from 'src/app/services/lesson.service';
import { FormsModule } from '@angular/forms';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';


const testLesson: Lesson = lessonTestData[0];
const testVocabularyList: ReadonlyArray<Vocabulary> = vocabularyTestData;

describe('QuizComponent', () => {
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;
  let location: Location;
  let router: Router;

  let component: QuizComponent;
  let fixture: ComponentFixture<QuizComponent>;

  let getDueLessonVocabularySpy: any;
  let getLessonsSpy: any;

  beforeEach(async(() => {
    const vocabularyService: any = jasmine.createSpyObj('VocabularyService', ['getDueLessonVocabulary']);
    getDueLessonVocabularySpy = vocabularyService.getDueLessonVocabulary.and.returnValue(of(testVocabularyList));

    const lessonService: any = jasmine.createSpyObj('LessonService', ['getLesson']);
    getLessonsSpy = lessonService.getLesson.and.returnValue(of(testLesson));

    TestBed.configureTestingModule({
      declarations: [ QuizComponent ],
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

  describe('should be unit tested', () => {
    xit('should be unit tested', () => {

    })
  });

  describe('should support keyboard navigation', () => {
    it('learned language should have autofocus', () => {
      const inputDE: DebugElement = fixture.debugElement.query(By.css('#quiz-learnedLanguage'));
      const inputElement: HTMLInputElement = inputDE.nativeElement;
      expect (inputElement.autofocus).toBeTrue();
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
