import { Location } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { DebugElement } from '@angular/core';
import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { ButtonModule, FormModule } from '@fundamental-ngx/core';
import { of } from 'rxjs';
import { routes } from 'src/app/app-routing.module';
import { LessonService } from 'src/app/lesson/lesson.service';
import { Lesson } from 'src/app/lesson/lesson.service.interface';
import { frontend } from 'src/app/resource.identifiers';
import { lessonTestData } from 'test/lesson.testdata.spec';
import { vocabularyTestData } from 'test/vocabulary.testdata.spec';
import { VocabularyService } from '../vocabulary.service';
import { Vocabulary } from '../vocabulary.service.interface';
import { AddVocabularyComponent } from './add-vocabulary.component';

const testLesson: Lesson = lessonTestData[0];
const testVocabulary: Vocabulary = vocabularyTestData[0];

describe('AddVocabularyComponent', () => {
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;
  let location: Location;
  let router: Router;

  let component: AddVocabularyComponent;
  let fixture: ComponentFixture<AddVocabularyComponent>;

  let getLessonsSpy: any;
  let createVocabularySpy: any;

  beforeEach(async(() => {
    const lessonService: any = jasmine.createSpyObj('LessonService', ['getLesson']);
    getLessonsSpy = lessonService.getLesson.and.returnValue(of(testLesson));

    const vocabularyService: any = jasmine.createSpyObj('VocabularyService', ['createVocabulary']);
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

  describe('should create component', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });
  });

  describe('should render UI elements', () => {
    it('should have the required labels', () => {
      let success = true;

      const expectedLabels: ReadonlyArray<string> = [testLesson.language_a, testLesson.language_b];

      const labels: NodeListOf<HTMLLabelElement> = fixture.nativeElement.querySelectorAll('label');

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
      const input: DebugElement = fixture.debugElement.query(By.css('#add-vocabulary-language_a'));
      const inputElement: any = input.nativeElement;
      expect(inputElement.value).toBe('');
    });

    it('should have "Known Language" input field filled', () => {
      const input: DebugElement = fixture.debugElement.query(By.css('#add-vocabulary-language_b'));
      const inputElement: any = input.nativeElement;
      expect(inputElement.value).toBe('');
    });
  });

  describe('should have required actions', () => {
    it('should have button "Add"', () => {
      const button: HTMLButtonElement = fixture.nativeElement.querySelector('#add-vocabulary-addButton');
      expect(button.textContent).toContain('Add');
    });

    it('should have button "Cancel"', () => {
      const button: HTMLButtonElement = fixture.nativeElement.querySelector('#add-vocabulary-cancelButton');
      expect(button.textContent).toContain('Cancel');
    });
  });

  describe('should route correctly on actions', () => {
    it('should stay on add-vocabulary when clicking "Add"', fakeAsync(() => {
      const currentLocation: string = location.path();
      const addButton: HTMLButtonElement = fixture.nativeElement.querySelector('#add-vocabulary-addButton');
      addButton.click();
      tick();

      expect(location.path()).toBe(currentLocation, 'should stay on addVocabulary');
    }));

    it('should navigate to list-vocabulary component when clicking "Cancel"', fakeAsync(() => {
      const cancelButton: HTMLButtonElement = fixture.nativeElement.querySelector('#add-vocabulary-cancelButton');
      cancelButton.click();
      tick();

      expect(location.path()).toBe(`/${frontend.lessons}/${component.lesson.id}/${frontend.vocabulary}`, 'should nav to listVocabulary');
    }));
  });
});
