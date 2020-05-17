import { TestBed } from '@angular/core/testing';

import { VocabularyService } from './vocabulary.service';
import { HttpClientTestingModule, HttpTestingController, TestRequest } from '@angular/common/http/testing';
import { Vocabulary } from './vocabulary.service.interface';
import { vocabularyTestData } from 'test/vocabulary.testdata.spec';
import { lessonTestData } from 'test/lesson.testdata.spec';
import { Lesson } from '../lesson/lesson.service.interface';
import { environment } from 'src/environments/environment';
import { backend } from '../resource.identifiers';

const testLesson: Lesson = lessonTestData[0];
const testVocabulary = vocabularyTestData;

let backendURL: string;
if (environment.backendUrl.charAt(environment.backendUrl.length - 1) === '/') {
  backendURL = environment.backendUrl.slice(0, -1);
} else {
  backendURL = environment.backendUrl;
}

describe('VocabularyService', () => {
  let httpTestingController: HttpTestingController;
  let vocabularyService: VocabularyService;

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
    vocabularyService = TestBed.inject(VocabularyService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(vocabularyService).toBeTruthy();
  });

  it('should create vocabulary', () => {
    const expectedVocabulary: Vocabulary = testVocabulary[0];
    vocabularyService.createVocabulary(expectedVocabulary).subscribe((vocabulary: Vocabulary) => { });

    requestCheck(`${backendURL}/${backend.vocabulary}`, 'POST', expectedVocabulary);
  });

  it('should get the lesson vocabulary', () => {
    const expectedVocabulary = testVocabulary;
    vocabularyService.getLessonVocabulary(testLesson.id.toString()).subscribe((vocabulary: Vocabulary[]) => { });

    requestCheck(`${backendURL}/${backend.lessons}/${testLesson.id}/${backend.vocabulary}`, 'GET', expectedVocabulary);
  });

  it('should get a single vocabulary', () => {
    const expectedVocabulary: Vocabulary = testVocabulary[0];
    vocabularyService.getVocabulary(expectedVocabulary.id.toString()).subscribe((vocabulary: Vocabulary) => { });

    requestCheck(`${backendURL}/${backend.vocabulary}/${expectedVocabulary.id.toString()}`, 'GET', expectedVocabulary);
  });

  it('should update a vocabulary', () => {
    const expectedVocabulary: Vocabulary = testVocabulary[0];
    vocabularyService.updateVocabulary(expectedVocabulary.id.toString(), expectedVocabulary).subscribe((vocabulary: Vocabulary) => { });

    requestCheck(`${backendURL}/${backend.vocabulary}/${expectedVocabulary.id.toString()}`, 'PATCH', expectedVocabulary);
  });

  it('should delete vocabulary', () => {
    const expectedVocabulary: Vocabulary = testVocabulary[0];

    vocabularyService.deleteVocabulary(expectedVocabulary.id.toString()).subscribe(() => { });

    requestCheck(`${backendURL}/${backend.vocabulary}/${expectedVocabulary.id.toString()}`, 'DELETE', expectedVocabulary);
  });
});
