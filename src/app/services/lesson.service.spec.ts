import { HttpClientTestingModule, HttpTestingController, TestRequest } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
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

  const requestCheck = async (url: string, method: string, testData: any) => {
    const req: TestRequest = httpTestingController.expectOne(url);
    expect(req.request.method).toBe(method);

    req.flush(testData);
    httpTestingController.verify();
  };

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

  it('should create a lesson', () => {
    const expectedLesson: Lesson = testLessons[0];
    lesssonService.createLesson(expectedLesson).subscribe(
      lesson => expect(lesson).toEqual(expectedLesson, 'expected lesson'),
      fail
    );

    requestCheck(backendURL + '/' + lessonsURI, 'POST', expectedLesson);
  });

  it('should get lessons', () => {
    lesssonService.getLessons().subscribe((lessons: Lesson[]) => {
      expect(lessons.length).toBe(testLessons.length);
    });

    requestCheck(backendURL + '/' + lessonsURI, 'GET', testLessons);
  });

  it('should get a lesson', () => {
    const expectedLesson: Lesson = testLessons[0];

    lesssonService.getLesson(expectedLesson.id.toString()).subscribe(
      lesson => expect(lesson).toEqual(expectedLesson, 'expected lesson'),
      fail
    );

    requestCheck(backendURL + '/' + lessonsURI + '/' + expectedLesson.id, 'GET', expectedLesson);
  });

  it('should update a lesson', () => {
    const updatedLesson: Lesson = testLessons[0];

    lesssonService.updateLesson(updatedLesson.id.toString(), updatedLesson).subscribe(
      () => { },
      fail
    );

    requestCheck(backendURL + '/' + lessonsURI + '/' + updatedLesson.id, 'PATCH', updatedLesson);
  });

  it('should delete a lesson', () => {
    const deletedLesson: Lesson = testLessons[0];

    lesssonService.deleteLesson(deletedLesson.id.toString()).subscribe(
      () => { },
      fail
    );

    requestCheck(backendURL + '/' + lessonsURI + '/' + deletedLesson.id, 'DELETE', deletedLesson);
  });
});
