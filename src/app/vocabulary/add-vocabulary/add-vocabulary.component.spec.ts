import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { AddVocabularyComponent } from './add-vocabulary.component';
import { HttpClient } from '@angular/common/http';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { lessonTestData } from 'test/lesson.testdata.spec';
import { of } from 'rxjs';
import { LessonService } from 'src/app/lesson/lesson.service';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { routes } from 'src/app/app-routing.module';
import { frontend } from 'src/app/resource.identifiers';

import { ButtonModule, FormModule } from '@fundamental-ngx/core';
import { vocabularyTestData } from 'test/vocabulary.testdata.spec';
import { VocabularyService } from '../vocabulary.service';

const testLesson = lessonTestData[0];
const testVocabulary = vocabularyTestData[0];

describe('AddVocabularyComponent', () => {
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;
  let location: Location;
  let router: Router;

  let component: AddVocabularyComponent;
  let fixture: ComponentFixture<AddVocabularyComponent>;

  let getLessonsSpy;
  let createVocabularySpy;

  beforeEach(async(() => {
    const lessonService = jasmine.createSpyObj('LessonService', ['getLesson']);
    getLessonsSpy = lessonService.getLesson.and.returnValue(of(testLesson));

    const vocabularyService = jasmine.createSpyObj('VocabularyService', ['createVocabulary']);
    createVocabularySpy = vocabularyService.createVocabulary.and.returnValue(of(testVocabulary));

    TestBed.configureTestingModule({
      declarations: [AddVocabularyComponent],
      imports: [
        ReactiveFormsModule,
        HttpClientTestingModule,
        RouterTestingModule.withRoutes(routes),
        ButtonModule,
        FormModule,
      ],
      providers: [
        { provide: LessonService, useValue: lessonService },
        { provide: VocabularyService, useValue: vocabularyService },
      ]
    })
      .compileComponents();

    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
  }));

  beforeEach(() => {
    router = TestBed.inject(Router);
    location = TestBed.inject(Location);
    fixture = TestBed.createComponent(AddVocabularyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('Test environment should be setup', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });
  });

  describe('should have the correct labels', () => {
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
  });

  describe('should have the required input fields', () => {
    it('should have "Learned Language" input field filled', () => {
      const input = fixture.debugElement.query(By.css('#add-vocabulary-language_a'));
      const inputElement = input.nativeElement;
      expect(inputElement.value).toBe('');
    });

    it('should have "Known Language" input field filled', () => {
      const input = fixture.debugElement.query(By.css('#add-vocabulary-language_b'));
      const inputElement = input.nativeElement;
      expect(inputElement.value).toBe('');
    });
  });

  describe('should have the required actions', () => {
    it('should have button "Add"', () => {
      const appElement: HTMLElement = fixture.nativeElement;
      const button = appElement.querySelector('#add-vocabulary-addButton');
      expect(button.textContent).toContain('Add');
    });

    it('should have button "Cancel"', () => {
      const appElement: HTMLElement = fixture.nativeElement;
      const button = appElement.querySelector('#add-vocabulary-cancelButton');
      expect(button.textContent).toContain('Cancel');
    });
  });

  describe('routing tests', () => {
    it('should stay on add-vocabulary when clicking "Add"', fakeAsync(() => {
      const currentLocation: string = location.path();
      const addButton: HTMLElement = fixture.nativeElement.querySelector('#add-vocabulary-addButton');
      addButton.click();
      tick();

      expect(location.path()).toBe(currentLocation, 'should stay on addVocabulary');
    }));

    it('should navigate to list-vocabulary component when clicking "Cancel"', fakeAsync(() => {
      const cancelButton: HTMLElement = fixture.nativeElement.querySelector('#add-vocabulary-cancelButton');
      cancelButton.click();
      tick();

      const id: number = component.lesson.id;
      expect(location.path()).toBe(`/${frontend.lessons}/${id}/${frontend.vocabulary}`, 'should nav to listVocabulary');
    }));
  });
});
