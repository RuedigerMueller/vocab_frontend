import { Location } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { ButtonModule, MenuModule, SplitButtonModule, TableModule } from '@fundamental-ngx/core';
import { Observable, of } from 'rxjs';
import { routes } from 'src/app/app-routing.module';
import { frontend } from 'src/app/resource.identifiers';
import { lessonTestData } from 'test/lesson.testdata.spec';
import { LessonService } from '../lesson.service';
import { ListLessonsComponent } from './list-lessons.component';

const testLessonList = lessonTestData;

describe('ListLessonsComponent', () => {
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;
  let location: Location;
  let router: Router;

  let component: ListLessonsComponent;
  let fixture: ComponentFixture<ListLessonsComponent>;

  let getLessonsSpy;
  let deleteLessonSpy;

  const expandSplitButton = () => {
    const appElement: HTMLElement = fixture.nativeElement;
    const expandableButton: HTMLElement = appElement.querySelector('.sap-icon--slim-arrow-down');
    expandableButton.click();
    fixture.detectChanges();
  };

  beforeEach(async(() => {
    const lessonService = jasmine.createSpyObj('LessonService', ['getLessons', 'deleteLesson']);
    getLessonsSpy = lessonService.getLessons.and.returnValue(of(testLessonList));
    deleteLessonSpy = lessonService.deleteLesson.and.returnValue(new Observable<void>());

    TestBed.configureTestingModule({
      declarations: [ListLessonsComponent],
      imports: [
        HttpClientTestingModule,
        RouterTestingModule.withRoutes(routes),
        TableModule,
        ButtonModule,
        SplitButtonModule,
        MenuModule
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
    fixture = TestBed.createComponent(ListLessonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('should create component', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });
  });

  describe('should render UI elements', () => {
    it('should have the required column heading', () => {
      let success = true;

      const expectedColumns = ['Title', 'Learned Language', 'Known Language', '#Vocabularies', '#Due Vocabularies', 'Actions'];

      const appElement: HTMLElement = fixture.nativeElement;
      const tableHeaders = appElement.querySelectorAll('th');

      for (const column of expectedColumns) {
        let found = false;
        tableHeaders.forEach((header) => {
          if (header.textContent === column) {
            found = true;
          }
        });

        if (found === false) {
          success = false;
          expect(found).toBeTruthy(`Column ${column} not found`);
        }
      }
      expect(success).toBeTruthy('All expected columns rendered');
      expect(getLessonsSpy.calls.any()).toBe(true, 'getLessons called');
    });
  });

  describe('should render UI elements', () => {
    it('should display a lesson with a title as defined in second test data entry', () => {
      const index = 1; // second element defined in testLessons
      const appElement: HTMLElement = fixture.nativeElement;
      const tableCell = appElement.querySelector(`#list-lessons-title-${index}`);
      expect(tableCell.textContent).toContain(testLessonList[index].title);
    });

    it('should display a lesson with a language_a as defined in first test data entry', () => {
      const index = 0; // first element defined in testLessons
      const appElement: HTMLElement = fixture.nativeElement;
      const tableCell = appElement.querySelector(`#list-lessons-language_a-${index}`);
      expect(tableCell.textContent).toContain(testLessonList[index].language_a);
    });

    it('should display a lesson with a language_b as defined in third test data entry', () => {
      const index = 2; // third element defined in testLessons
      const appElement: HTMLElement = fixture.nativeElement;
      const tableCell = appElement.querySelector(`#list-lessons-language_b-${index}`);
      expect(tableCell.textContent).toContain(testLessonList[index].language_b);
    });

    it('should display a lesson with a numberVocables as defined in first test data entry', () => {
      const index = 0; // first element defined in testLessons
      const appElement: HTMLElement = fixture.nativeElement;
      const tableCell = appElement.querySelector(`#list-lessons-numberVocables-${index}`);
      expect(tableCell.textContent).toContain(testLessonList[index].numberVocables.toString());
    });

    it('should display a lesson with a numberDueVocables as defined in second test data entry', () => {
      const index = 1; // second element defined in testLessons
      const appElement: HTMLElement = fixture.nativeElement;
      const tableCell = appElement.querySelector(`#list-lessons-numberDueVocables-${index}`);
      expect(tableCell.textContent).toContain(testLessonList[index].numberDueVocables.toString());
    });
  });

  describe('should have required actions',() => {
    it('should have required buttons', () => {
      let success = true;

      const expectedActions = ['Create', 'Quiz' ];

      const appElement: HTMLElement = fixture.nativeElement;
      const actions: NodeListOf<HTMLElement> = appElement.querySelectorAll('button');

      for (const expectedAction of expectedActions) {
        let found = false;
        actions.forEach((action) => {
          if (action.textContent.trim() === expectedAction) {
            found = true;
          }
        });

        if (found === false) {
          success = false;
          expect(found).toBeTruthy(`Action ${expectedAction} not found`);
        }
      }
      expect(success).toBeTruthy('All expected actions rendered');
      expect(getLessonsSpy.calls.any()).toBe(true, 'getLessons called');
    });

    it('should have the required actions as part of the split button', () => {
      let success = true;

      expandSplitButton();

      const expectedActions = ['Edit', 'Delete', 'Vocabulary' ];
      const appElement: HTMLElement = fixture.nativeElement;
      const actions: NodeListOf<HTMLElement> = appElement.querySelectorAll('li');

      for (const expectedAction of expectedActions) {
        let found = false;
        actions.forEach((action) => {
          if (action.textContent.trim() === expectedAction) {
            found = true;
          }
        });

        if (found === false) {
          success = false;
          expect(found).toBeTruthy(`Action ${expectedAction} not found`);
        }
      }
      expect(success).toBeTruthy('All expected actions rendered');
      expect(getLessonsSpy.calls.any()).toBe(true, 'getLessons called');
    });
  });

  describe('should route correctly on actions', () => {
    it('should navigate to add-lesson component when clicking "Create"', fakeAsync(() => {
      const createButton: HTMLElement = fixture.nativeElement.querySelector('#list-lessons-createAction');
      createButton.click();
      tick();

      expect(location.path()).toBe(`/${frontend.lessons}/${frontend.createLesson}`, 'should nav to createLesson');
    }));

    it('should navigate to edit-lesson component when clicking "Edit"', fakeAsync(() => {
      expandSplitButton();
      const editButton: HTMLElement = fixture.nativeElement.querySelector('#list-lessons-editAction-0');
      editButton.click();
      tick();

      const id = component.lessons[0].id;
      expect(location.path()).toBe(`/${frontend.lessons}/${id}/${frontend.editLesson}`, 'should nav to editLesson for first lesson');
    }));

    it('should stay on list-lessons component when clicking "Delete"', fakeAsync(() => {
      const currentPath = location.path();
      expandSplitButton();
      const deleteButton: HTMLElement = fixture.nativeElement.querySelector('#list-lessons-deleteAction-0');
      deleteButton.click();
      tick();

      expect(location.path()).toBe(currentPath);
    }));

    it('should navigate to listVocabularies component when clicking "Vocabulary"', fakeAsync(() => {
      expandSplitButton();
      const vocabulariesButton: HTMLElement = fixture.nativeElement.querySelector('#list-lessons-vocabularyAction-0');
      vocabulariesButton.click();
      tick();

      const id = component.lessons[0].id;
      expect(location.path()).toBe(`/${frontend.lessons}/${id}/${frontend.vocabulary}`, 'should nav to listVocabularies for first lesson');
    }));
  });
});
