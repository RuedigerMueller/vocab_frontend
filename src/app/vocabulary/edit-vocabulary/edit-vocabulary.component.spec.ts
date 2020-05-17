import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { EditVocabularyComponent } from './edit-vocabulary.component';
import { HttpClient } from '@angular/common/http';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { lessonTestData } from 'test/lesson.testdata.spec';
import { of } from 'rxjs';
import { LessonService } from 'src/app/lesson/lesson.service';
import { vocabularyTestData } from 'test/vocabulary.testdata.spec';
import { VocabularyService } from '../vocabulary.service';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { routes } from 'src/app/app-routing.module';
import { frontend } from 'src/app/resource.identifiers';
import { ButtonModule, FormModule } from '@fundamental-ngx/core';

const testLesson = lessonTestData[0];
const testVocabularyList = vocabularyTestData;

describe('EditVocabularyComponent', () => {
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;
  let location: Location;
  let router: Router;

  let component: EditVocabularyComponent;
  let fixture: ComponentFixture<EditVocabularyComponent>;

  let getVocabularySpy;
  let updateVocabularySpy;
  let getLessonsSpy;

  beforeEach(async(() => {
    const vocabularyService = jasmine.createSpyObj('VocabularyService', ['getVocabulary', 'updateVocabulary']);
    getVocabularySpy = vocabularyService.getVocabulary.and.returnValue(of(testVocabularyList[0]));
    updateVocabularySpy = vocabularyService.updateVocabulary.and.returnValue(of(testVocabularyList[0]));

    const lessonService = jasmine.createSpyObj('LessonService', ['getLesson']);
    getLessonsSpy = lessonService.getLesson.and.returnValue(of(testLesson));

    TestBed.configureTestingModule({
      declarations: [EditVocabularyComponent],
      imports: [
        ReactiveFormsModule,
        HttpClientTestingModule,
        RouterTestingModule.withRoutes(routes),
        ButtonModule,
        FormModule,
      ],
      providers: [
        { provide: VocabularyService, useValue: vocabularyService },
        { provide: LessonService, useValue: lessonService },
      ]
    })
      .compileComponents();

    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
  }));

  beforeEach(() => {
    router = TestBed.inject(Router);
    location = TestBed.inject(Location);
    fixture = TestBed.createComponent(EditVocabularyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('Test environment should be setup', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });
  });

  describe('should have the required UI elements', () => {
    it('should have the required labels', () => {
      let success = true;

      const expectedLabels = [testLesson.language_a, testLesson.language_b];

      const appElement: HTMLElement = fixture.nativeElement;
      const labels = appElement.querySelectorAll('label');

      for (const expectedLabel of expectedLabels) {
        let found = false;
        labels.forEach((label) => {
          if (label.textContent === expectedLabel) {
            found = true;
          }
        });

        if (found === false) {
          success = false;
          expect(found).toBeTruthy(`Label ${expectedLabel} not found`);
        }
      }
      expect(success).toBeTruthy('All expected labels rendered');
    });

    it('should have "Learned Language" input field filled', () => {
      const input = fixture.debugElement.query(By.css('#edit-vocabulary-language_a'));
      const inputElement = input.nativeElement;
      expect(inputElement.value).toContain(testVocabularyList[0].language_a);
      expect(getVocabularySpy.calls.any()).toBe(true, 'getVocabulary called');
    });

    it('should have "Known Language" input field filled', () => {
      const input = fixture.debugElement.query(By.css('#edit-vocabulary-language_b'));
      const inputElement = input.nativeElement;
      expect(inputElement.value).toContain(testVocabularyList[0].language_b);
      expect(getVocabularySpy.calls.any()).toBe(true, 'getVocabulary called');
    });
  });

  describe('should have the expected actions', () => {
    it('should have button "Save"', () => {
      const appElement: HTMLElement = fixture.nativeElement;
      const button = appElement.querySelector('#edit-vocabulary-saveButton');
      expect(button.textContent).toContain('Save');
    });

    it('should have button "Cancel"', () => {
      const appElement: HTMLElement = fixture.nativeElement;
      const button = appElement.querySelector('#edit-vocabulary-cancelButton');
      expect(button.textContent).toContain('Cancel');
    });
  });

  describe('routing tests', () => {
    it('should navigate to list-lessons component when clicking "Save"', fakeAsync(() => {
      const saveButton: HTMLElement = fixture.nativeElement.querySelector('#edit-vocabulary-saveButton');
      saveButton.click();
      tick();

      const id: number = component.lesson.id;
      expect(location.path()).toBe(`/${frontend.lessons}/${id}/${frontend.vocabulary}`, 'should nav to listVocabulary');
    }));

    it('should navigate to list-lessons component when clicking "Cancel"', fakeAsync(() => {
      const cancelButton: HTMLElement = fixture.nativeElement.querySelector('#edit-vocabulary-cancelButton');
      cancelButton.click();
      tick();

      const id: number = component.lesson.id;
      expect(location.path()).toBe(`/${frontend.lessons}/${id}/${frontend.vocabulary}`, 'should nav to listVocabulary');
    }));
  });
  
});
