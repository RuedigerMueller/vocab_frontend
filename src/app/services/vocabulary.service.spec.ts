import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { requestCheck } from 'test/helpers.spec';
import { lessonTestData } from 'test/lesson.testdata.spec';
import { vocabularyTestData } from 'test/vocabulary.testdata.spec';
import { Lesson } from '../models/lesson.model.';
import { backend, baseURL } from '../resource.identifiers';
import { VocabularyService } from './vocabulary.service';


describe('VocabularyService', () => {
  let httpTestingController: HttpTestingController;
  let vocabularyService: VocabularyService;
  const testLesson: Lesson = lessonTestData[0];
  const testVocabulary = vocabularyTestData;
  const backendURL: string = baseURL;
  const vocabularyURI: string = backend.vocabulary;
  const lessonURI: string = backend. lessons;

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

  it('should POST to backend vocabulary service', () => {
    const expectedURL: string = backendURL + '/' + vocabularyURI;
    const expectedMethod = 'POST';
    const expectedPayload: string = JSON.stringify(testVocabulary[0]);

    vocabularyService.createVocabulary(testVocabulary[0]).subscribe();

    requestCheck(httpTestingController, expectedURL, expectedMethod, expectedPayload);
  });

  xit('should GET lesson vocabulary from backend lesson service', () => {
    /* const expectedURL: string = backendURL + '/' + lessonURI + '/' + testLesson.id + '/' + vocabularyURI;
    const expectedMethod = 'GET';
    const expectedPayload = null;

    vocabularyService.getLessonVocabulary(testLesson.id.toString()).subscribe();

    requestCheck(httpTestingController, expectedURL, expectedMethod, expectedPayload); */
  });

  xit('should GET a single vocabulary from backend vocabulary service', () => {
    /* const expectedURL: string = backendURL + '/' + vocabularyURI + '/' + testVocabulary[0].id;
    const expectedMethod = 'GET';
    const expectedPayload = null;

    vocabularyService.getVocabulary(testVocabulary[0].id.toString()).subscribe();

    requestCheck(httpTestingController, expectedURL, expectedMethod, expectedPayload); */
  });

  xit('should PATCH vocabulary with ID at backend vocabulary service', () => {
    /* const expectedURL: string = backendURL + '/' + vocabularyURI + '/' + testVocabulary[0].id;
    const expectedMethod = 'PATCH';
    const expectedPayload: string = JSON.stringify(testVocabulary[0]);

    vocabularyService.updateVocabulary(testVocabulary[0].id.toString(), testVocabulary[0]).subscribe();

    requestCheck(httpTestingController, expectedURL, expectedMethod, expectedPayload); */
  });

  xit('should DELETE vocabulary with ID at backend vocabulary service', () => {
    /* const expectedURL: string = backendURL + '/' + vocabularyURI + '/' + testVocabulary[0].id;
    const expectedMethod = 'DELETE';
    const expectedPayload = null;

    vocabularyService.deleteVocabulary(testVocabulary[0].id.toString()).subscribe();

    requestCheck(httpTestingController, expectedURL, expectedMethod, expectedPayload); */
  });
});
