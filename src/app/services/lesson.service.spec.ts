import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { requestCheck } from 'test/helpers.spec';
import { lessonTestData } from 'test/lesson.testdata.spec';
import { Lesson } from '../models/lesson.model.';
import { backend, baseURL } from '../resource.identifiers';
import { LessonService } from './lesson.service';

describe('LessonService', () => {
  let lesssonService: LessonService;
  let httpTestingController: HttpTestingController;
  const testLessons: ReadonlyArray<Lesson> = lessonTestData;
  const backendURL: string = baseURL;
  const lessonsURI: string = backend.lessons;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    lesssonService = TestBed.inject(LessonService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(lesssonService).toBeTruthy();
  });

  it('should POST to backend lesson service', () => {
    const expectedURL: string = backendURL + '/' + lessonsURI;
    const expectedMethod = 'POST';
    const expectedPayload: string = JSON.stringify(testLessons[0]);

    lesssonService.createLesson(testLessons[0]).subscribe();

    requestCheck(httpTestingController, expectedURL, expectedMethod, expectedPayload);
  });

  it('should GET lessons from backend lesson service', () => {
    const expectedURL: string = backendURL + '/' + lessonsURI;
    const expectedMethod = 'GET';
    const expectedPayload = null;

    lesssonService.getLessons().subscribe();

    requestCheck(httpTestingController, expectedURL, expectedMethod, expectedPayload);
  });

  xit('should GET lesson with ID from backend lesson service', () => {
    /* const expectedURL: string = backendURL + '/' + lessonsURI + '/' + testLessons[0].id;
    const expectedMethod = 'GET';
    const expectedPayload = null;

    lesssonService.getLesson(testLessons[0].id.toString()).subscribe();

    requestCheck(httpTestingController, expectedURL, expectedMethod, expectedPayload); */
  });

  xit('should PATCH lesson with ID at backend lesson service', () => {
    /* const expectedURL: string = backendURL + '/' + lessonsURI + '/' + testLessons[0].id;
    const expectedMethod = 'PATCH';
    const expectedPayload: string = JSON.stringify(testLessons[0]);

    lesssonService.updateLesson(testLessons[0].id.toString(), testLessons[0]).subscribe();

    requestCheck(httpTestingController, expectedURL, expectedMethod, expectedPayload); */
  });

  xit('should DELETE lesson with ID at backend lesson service', () => {
    /* const expectedURL: string = backendURL + '/' + lessonsURI + '/' + testLessons[0].id;
    const expectedMethod = 'DELETE';
    const expectedPayload = null;

    lesssonService.deleteLesson(testLessons[0].id.toString()).subscribe();

    requestCheck(httpTestingController, expectedURL, expectedMethod, expectedPayload); */
  });
});
