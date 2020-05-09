import { TestBed } from '@angular/core/testing';

import { VocabularyService } from './vocabulary.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('VocabularyService', () => {
  let httpTestingController: HttpTestingController;
  let vocabularyService: VocabularyService;

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
});
