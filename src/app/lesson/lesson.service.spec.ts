import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController, TestRequest } from '@angular/common/http/testing';
import { HttpClient } from '@angular/common/http';

import { LessonService } from './lesson.service';
import { Lesson } from './lesson.service.interface';
import { environment } from 'src/environments/environment';

const testLessons: Lesson[] = [
  { id: 2, user: 'User1', title: 'Unit 2', language_a: 'English', language_b: 'Deutsch', numberVocables: 30, numberDueVocables: 2 },
  { id: 4, user: 'User1', title: 'Unidad 1', language_a: 'Español', language_b: 'Deutsch', numberVocables: 0, numberDueVocables: 0 },
  { id: 5, user: 'User1', title: 'Unidad 1', language_a: 'Español', language_b: 'Deutsch', numberVocables: 0, numberDueVocables: 0 },
];

describe('LessonService', () => {
  let httpTestingController: HttpTestingController;
  let lesssonService: LessonService;
  const lessonsURI = 'lessons/';

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

  it('should get lessons', () => {
    const expectedLessons: Lesson[] = testLessons;
    lesssonService.getLessons().subscribe((lessons: Lesson[]) => {
      expect(lessons.length).toBe(expectedLessons.length);
    });

    requestCheck(environment.backendUrl + lessonsURI, 'GET', expectedLessons);
  });

  it('should get a lesson', () => {
    const expectedLesson: Lesson = testLessons[0];

    lesssonService.getLesson(expectedLesson.id.toString()).subscribe(
      lesson => expect(lesson).toEqual(expectedLesson, 'expected lesson'),
      fail
    );

    requestCheck(environment.backendUrl + lessonsURI + expectedLesson.id, 'GET', expectedLesson);
  });

  it('should update a lesson', () => {
    const updatedLesson: Lesson = testLessons[0];

    lesssonService.updateLesson(updatedLesson.id.toString(), updatedLesson).subscribe(
      () => { },
      fail
    );

    requestCheck(environment.backendUrl + lessonsURI + updatedLesson.id, 'PATCH', updatedLesson);
  });

  it('should delete a lesson', () => {
    const deletedLesson: Lesson = testLessons[0];

    lesssonService.deleteLesson(deletedLesson.id.toString()).subscribe(
      () => { },
      fail
    );

    requestCheck(environment.backendUrl + lessonsURI + deletedLesson.id, 'DELETE', deletedLesson);
  });
});
