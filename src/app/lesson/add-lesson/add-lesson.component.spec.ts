import { async, ComponentFixture, TestBed, tick, fakeAsync } from '@angular/core/testing';

import { AddLessonComponent } from './add-lesson.component';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClient } from '@angular/common/http';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { routes } from 'src/app/app-routing.module';
import { frontend } from 'src/app/resource.identifiers';

import { ButtonModule, FormModule } from '@fundamental-ngx/core';
import { lessonTestData } from 'test/lesson.testdata.spec';
import { of } from 'rxjs';
import { LessonService } from '../lesson.service';

const testAddLesson = lessonTestData[0];

describe('AddLessonComponent', () => {
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;
  let location: Location;
  let router: Router;

  let component: AddLessonComponent;
  let fixture: ComponentFixture<AddLessonComponent>;

  let addLessonSpy;

  beforeEach(async(() => {
    const lessonService = jasmine.createSpyObj('LessonService', ['createLesson']);
    addLessonSpy = lessonService.createLesson.and.returnValue(of(testAddLesson));

    TestBed.configureTestingModule({
      declarations: [AddLessonComponent],
      imports: [
        ReactiveFormsModule,
        RouterTestingModule.withRoutes(routes),
        HttpClientTestingModule,
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
    fixture = TestBed.createComponent(AddLessonComponent);
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

    it('should have input field for "Title"', () => {
      const input = fixture.debugElement.query(By.css('#add-lesson-title'));
      const inputElement = input.nativeElement;
      expect(inputElement.value).toBe('');
    });

    it('should have input field for "Learned Language"', () => {
      const input = fixture.debugElement.query(By.css('#add-lesson-language_a'));
      const inputElement = input.nativeElement;
      expect(inputElement.value).toBe('');
    });

    it('should have input field for "Known Language"', () => {
      const input = fixture.debugElement.query(By.css('#add-lesson-language_b'));
      const inputElement = input.nativeElement;
      expect(inputElement.value).toBe('');
    });
  });

  describe('should have the required actioms', () => {
    it('should have button "Create"', () => {
      const appElement: HTMLElement = fixture.nativeElement;
      const button = appElement.querySelector('#add-lesson-createButton');
      expect(button.textContent).toContain('Create');
    });

    it('should have button "Cancel"', () => {
      const appElement: HTMLElement = fixture.nativeElement;
      const button = appElement.querySelector('#add-lesson-cancelButton');
      expect(button.textContent).toContain('Cancel');
    });
  });

  describe('routing tests', () => {
    it('should navigate to list-lessons component when clicking "Create"', fakeAsync(() => {
      const createButton: HTMLElement = fixture.nativeElement.querySelector('#add-lesson-createButton');
      createButton.click();
      tick();

      expect(location.path()).toBe(`/${frontend.lessons}`, 'should nav to listLessons');
    }));

    it('should navigate to list-lessons component when clicking "Cancel"', fakeAsync(() => {
      const cancelButton: HTMLElement = fixture.nativeElement.querySelector('#add-lesson-cancelButton');
      cancelButton.click();
      tick();

      expect(location.path()).toBe(`/${frontend.lessons}`, 'should nav to listLessons');
    }));
  });
});

