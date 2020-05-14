import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditLessonComponent } from './edit-lesson.component';
import { HttpClient } from '@angular/common/http';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { LessonService } from '../lesson.service';
import { By } from '@angular/platform-browser';
import { lessonTestData } from 'test/lesson.testdata.spec';
import { ButtonModule, FormModule } from '@fundamental-ngx/core';

const testEditLesson = lessonTestData[0];

describe('EditLessonComponent', () => {
  let component: EditLessonComponent;
  let fixture: ComponentFixture<EditLessonComponent>;

  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;

  let getLessonSpy;

  beforeEach(async(() => {
    const lessonService = jasmine.createSpyObj('LessonService', ['getLesson']);
    getLessonSpy = lessonService.getLesson.and.returnValue(of(testEditLesson));
    const routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl']);

    TestBed.configureTestingModule({
      declarations: [EditLessonComponent],
      imports: [
        ReactiveFormsModule,
        HttpClientTestingModule,
        RouterTestingModule.withRoutes([]),
        ButtonModule,
        FormModule
      ],
      providers: [
        // { provide: Router, useValue: routerSpy },
        { provide: LessonService, useValue: lessonService },
      ]
    })
      .compileComponents();

    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditLessonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have the required labels', () => {
    let success = true;

    const expectedLabels = ['Title', 'Learned language', 'Known language'];

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

  it('should have "Title" input field filled', () => {
    const input = fixture.debugElement.query(By.css('#edit-lesson-title'));
    const inputElement = input.nativeElement;
    expect(inputElement.value).toBe(testEditLesson.title);
    expect(getLessonSpy.calls.any()).toBe(true, 'getLesson called');
  });

  it('should have "Learned Language" input field filled', () => {
    const input = fixture.debugElement.query(By.css('#edit-lesson-language_a'));
    const inputElement = input.nativeElement;
    expect(inputElement.value).toContain(testEditLesson.language_a);
    expect(getLessonSpy.calls.any()).toBe(true, 'getLesson called');
  });

  it('should have "Known Language" input field filled', () => {
    const input = fixture.debugElement.query(By.css('#edit-lesson-language_b'));
    const inputElement = input.nativeElement;
    expect(inputElement.value).toContain(testEditLesson.language_b);
    expect(getLessonSpy.calls.any()).toBe(true, 'getLesson called');
  });

  describe('should have the expected actions', () => {
    it('should have button "Save"', () => {
      const appElement: HTMLElement = fixture.nativeElement;
      const button = appElement.querySelector('#edit-lesson-saveButton');
      expect(button.textContent).toContain('Save');
    });

    it('should have button "Cancel"', () => {
      const appElement: HTMLElement = fixture.nativeElement;
      const button = appElement.querySelector('#edit-lesson-cancelButton');
      expect(button.textContent).toContain('Cancel');
    });
  });

  xit('should navigate to list-lessons component when clicking "Save"', () => {

  });
});
