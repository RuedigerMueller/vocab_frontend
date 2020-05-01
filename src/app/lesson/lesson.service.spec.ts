import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClient } from '@angular/common/http';

import { LessonService } from './lesson.service';
import { TileTextDirective } from '@fundamental-ngx/core/lib/tile/tile-text/tile-text.directive';
import { i18nMetaToDocStmt } from '@angular/compiler/src/render3/view/i18n/meta';
import { IterableDiffers } from '@angular/core';

describe('LessonService', () => {
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;

  let service: LessonService;


  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ],
    });
    service = TestBed.inject(LessonService);

    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get lessons');
  it('should create a lesson');
  it('should delete a lesson');
  it('should update a lesson');
});
