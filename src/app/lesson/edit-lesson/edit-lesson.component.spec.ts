import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

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
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { routes } from 'src/app/app-routing.module';
import { frontend } from 'src/app/resource.identifiers';

const testEditLesson = lessonTestData[0];

describe('EditLessonComponent', () => {
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;
  let location: Location;
  let router: Router;

  let component: EditLessonComponent;
  let fixture: ComponentFixture<EditLessonComponent>;

  let getLessonSpy;
  let updateLessonSpy;

  beforeEach(async(() => {
    const lessonService = jasmine.createSpyObj('LessonService', ['getLesson', 'updateLesson']);
    getLessonSpy = lessonService.getLesson.and.returnValue(of(testEditLesson));
    updateLessonSpy = lessonService.updateLesson.and.returnValue(of(testEditLesson));

    TestBed.configureTestingModule({
      declarations: [EditLessonComponent],
      imports: [
        ReactiveFormsModule,
        HttpClientTestingModule,
        RouterTestingModule.withRoutes(routes),
        ButtonModule,
        FormModule
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
    router = TestBed.inject(Router);
    location = TestBed.inject(Location);
    fixture = TestBed.createComponent(EditLessonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('Test environment should be setup', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });
  });

  describe('UI elements should be displayed', () => {
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

  describe('routing tests', () => {
    it('should navigate to list-lessons component when clicking "Save"', fakeAsync(() => {
      const saveButton: HTMLElement = fixture.nativeElement.querySelector('#edit-lesson-saveButton');
      saveButton.click();
      tick();

      expect(location.path()).toBe(`/${frontend.lessons}`, 'should nav to listLessons');
    }));

    it('should navigate to list-lessons component when clicking "Cancel"', fakeAsync(() => {
      const cancelButton: HTMLElement = fixture.nativeElement.querySelector('#edit-lesson-cancelButton');
      cancelButton.click();
      tick();

      expect(location.path()).toBe(`/${frontend.lessons}`, 'should nav to listLessons');
    }));
  });
});
