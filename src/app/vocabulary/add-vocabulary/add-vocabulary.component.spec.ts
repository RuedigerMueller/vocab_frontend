import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddVocabularyComponent } from './add-vocabulary.component';
import { HttpClient } from '@angular/common/http';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { lessonTestData } from 'test/lesson.testdata.spec';
import { of } from 'rxjs';
import { LessonService } from 'src/app/lesson/lesson.service';
import { By } from '@angular/platform-browser';

import { ButtonModule, FormModule } from '@fundamental-ngx/core';

const testLesson = lessonTestData[0];

describe('AddVocabularyComponent', () => {
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;

  let component: AddVocabularyComponent;
  let fixture: ComponentFixture<AddVocabularyComponent>;

  let getLessonsSpy;

  const lessonService = jasmine.createSpyObj('LessonService', ['getLesson']);
  getLessonsSpy = lessonService.getLesson.and.returnValue(of(testLesson));

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AddVocabularyComponent],
      imports: [
        ReactiveFormsModule,
        HttpClientTestingModule,
        RouterTestingModule.withRoutes([]),
        ButtonModule,
        FormModule,
      ],
      providers: [
        { provide: LessonService, useValue: lessonService },
      ]
    })
      .compileComponents();

    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddVocabularyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('should have the correct labels', () => {

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
    xit('should navigate to list-lessons component when clicking "Create"', () => {

    });

    xit('should navigate to list-lessons component when clicking "Cancel"', () => {

    });
  });
});
