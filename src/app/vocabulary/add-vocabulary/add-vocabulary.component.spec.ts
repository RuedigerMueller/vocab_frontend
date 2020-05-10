import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddVocabularyComponent } from './add-vocabulary.component';
import { HttpClient } from '@angular/common/http';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { lessonTestData } from 'test/lesson.testdata.spec';
import { of } from 'rxjs';
import { LessonService } from 'src/app/lesson/lesson.service';

const testLesson = lessonTestData[0];

describe('AddVocabularyComponent', () => {
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;

  let component: AddVocabularyComponent;
  let fixture: ComponentFixture<AddVocabularyComponent>;

  let getLessonsSpy;

  const lessonService = jasmine.createSpyObj('LessonService', ['getLesson']);
  getLessonsSpy = lessonService.getLesson.and.returnValue(of(testLesson));

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddVocabularyComponent ],
      imports: [
        ReactiveFormsModule,
        HttpClientTestingModule,
        RouterTestingModule.withRoutes([]),
      ],
      providers: [
        { provide: LessonService, useValue: lessonService },
      ]
    })
    .compileComponents();

    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddVocabularyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
