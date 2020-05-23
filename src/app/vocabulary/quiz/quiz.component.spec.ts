import { Location } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs/internal/observable/of';
import { routes } from 'src/app/app-routing.module';
import { Lesson } from 'src/app/lesson/lesson.service.interface';
import { lessonTestData } from 'test/lesson.testdata.spec';
import { vocabularyTestData } from 'test/vocabulary.testdata.spec';
import { VocabularyService } from '../vocabulary.service';
import { Vocabulary } from '../vocabulary.service.interface';
import { QuizComponent } from './quiz.component';


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
  // let getLessonsSpy: any;

  beforeEach(async(() => {
    const vocabularyService: any = jasmine.createSpyObj('VocabularyService', ['getDueLessonVocabulary']);
    getDueLessonVocabularySpy = vocabularyService.getDueLessonVocabulary.and.returnValue(of(testVocabularyList));

    TestBed.configureTestingModule({
      declarations: [ QuizComponent ],
      imports: [
        HttpClientTestingModule,
        RouterTestingModule.withRoutes(routes),
      ],
      providers: [
        { provide: VocabularyService, useValue: vocabularyService },
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
});
