import { Location } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { DebugElement } from '@angular/core';
import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { ButtonModule, MenuModule, SplitButtonComponent, SplitButtonModule, TableModule } from '@fundamental-ngx/core';
import { Observable, of } from 'rxjs';
import { routes } from 'src/app/app-routing.module';
import { AuthGuardService } from 'src/app/helpers/auth-guard.service';
import { frontend } from 'src/app/resource.identifiers';
import { lessonTestData } from 'test/lesson.testdata.spec';
import { Lesson } from '../../models/lesson.model.';
import { LessonService } from '../../services/lesson.service';
import { ListLessonsComponent } from './list-lessons.component';

describe('ListLessonsComponent', () => {
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;
  let location: Location;
  let router: Router;

  let component: ListLessonsComponent;
  let fixture: ComponentFixture<ListLessonsComponent>;
 
  // Added for testing...
  let debugElement: DebugElement;

  let getLessonsSpy: any;
  let deleteLessonSpy: any;
  let canActivateSpy: any;

  const testLessonList: ReadonlyArray<Lesson> = lessonTestData;

  const expandSplitButton = () => {
    //const expandableButton: HTMLButtonElement = fixture.nativeElement.querySelector('.sap-icon--slim-arrow-down');
    const expandableButton: HTMLDivElement = fixture.nativeElement.querySelector('#list-lessons-quizAction-0 > div');
    expandableButton.click();
    //tick();
    //fixture.detectChanges();
  };

  beforeEach(async(() => {
    const lessonService: any = jasmine.createSpyObj('LessonService', ['getLessons', 'deleteLesson']);
    getLessonsSpy = lessonService.getLessons.and.returnValue(of(testLessonList));
    deleteLessonSpy = lessonService.deleteLesson.and.returnValue(new Observable<void>());

    const authGuardService: any = jasmine.createSpyObj('AuthGuardService', ['canActivate']);
    canActivateSpy = authGuardService.canActivate.and.returnValue(true);

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
        { provide: AuthGuardService, useValue: authGuardService },
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
    
    // Added for testing
    debugElement = fixture.debugElement;

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

      const expectedColumns: ReadonlyArray<string> = ['Title', 'Learned Language', 'Known Language', '#Vocabularies', '#Due Vocabularies', 'Actions'];

      const tableHeaders: NodeListOf<HTMLLabelElement> = fixture.nativeElement.querySelectorAll('th');

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
      const tableCell: HTMLTableCellElement = fixture.nativeElement.querySelector(`#list-lessons-title-${index}`);
      expect(tableCell.textContent).toContain(testLessonList[index].title);
    });

    it('should display a lesson with a language_a as defined in first test data entry', () => {
      const index = 0; // first element defined in testLessons
      const tableCell: HTMLTableCellElement = fixture.nativeElement.querySelector(`#list-lessons-language_a-${index}`);
      expect(tableCell.textContent).toContain(testLessonList[index].language_a);
    });

    it('should display a lesson with a language_b as defined in third test data entry', () => {
      const index = 2; // third element defined in testLessons
      const tableCell: HTMLTableCellElement = fixture.nativeElement.querySelector(`#list-lessons-language_b-${index}`);
      expect(tableCell.textContent).toContain(testLessonList[index].language_b);
    });

    it('should display a lesson with a numberVocables as defined in first test data entry', () => {
      const index = 0; // first element defined in testLessons
      const tableCell: HTMLTableCellElement = fixture.nativeElement.querySelector(`#list-lessons-numberVocables-${index}`);
      expect(tableCell.textContent).toContain(testLessonList[index].numberVocables.toString());
    });

    it('should display a lesson with a numberDueVocables as defined in second test data entry', () => {
      const index = 1; // second element defined in testLessons
      const tableCell: HTMLTableCellElement = fixture.nativeElement.querySelector(`#list-lessons-numberDueVocables-${index}`);
      expect(tableCell.textContent).toContain(testLessonList[index].numberDueVocables.toString());
    });
  });

  describe('should have required actions',() => {
    it('should have required buttons', () => {
      let success = true;

      const expectedActions: ReadonlyArray<string> = ['Create', 'Quiz' ];

      const actions: NodeListOf<HTMLButtonElement> = fixture.nativeElement.querySelectorAll('button');

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

    it('should have the required actions as part of the split button', fakeAsync(() => {
      let success = true;

      // Added for test
      const splitButtonComponent = debugElement.query(By.directive(SplitButtonComponent));
      const splitButtonComponentInstance: SplitButtonComponent = splitButtonComponent.injector.get(SplitButtonComponent);

      // expandSplitButton();

      const expectedActions: ReadonlyArray<string> = ['Edit', 'Delete', 'Vocabulary' ];
      const actions: NodeListOf<HTMLLIElement> = fixture.nativeElement.querySelectorAll('span');

      for (const expectedAction of expectedActions) {
        let found = false;
        /* actions.forEach((action) => {
          if (action.textContent.trim() === expectedAction) {
            found = true;
          }
        }); */
        for (const menuItem of splitButtonComponentInstance.menu.menuItems) {
          if (menuItem.menuItemTitle.title.trim() === expectedAction) {
            found = true;
          }
        }

        if (found === false) {
          success = false;
          expect(found).toBeTruthy(`Action ${expectedAction} not found`);
        }
      }
      expect(success).toBeTruthy('All expected actions rendered');
      expect(getLessonsSpy.calls.any()).toBe(true, 'getLessons called');
    }));
  });

  describe('should route correctly on actions', () => {
    it('should navigate to add-lesson component when clicking "Create"', fakeAsync(() => {
      const createButton: HTMLButtonElement = fixture.nativeElement.querySelector('#list-lessons-createAction');
      createButton.click();
      tick();

      expect(location.path()).toBe(`/${frontend.lessons}/${frontend.createLesson}`, 'should nav to createLesson');
    }));

    it('should navigate to edit-lesson component when clicking "Edit"', fakeAsync(() => {
      expandSplitButton();
      const editButton: HTMLLIElement = fixture.nativeElement.querySelector('#list-lessons-editAction-0');
      editButton.click();
      tick();

      expect(location.path()).toBe(`/${frontend.lessons}/${component.lessons[0].id}/${frontend.editLesson}`, 'should nav to editLesson for first lesson');
    }));

    xit('should stay on list-lessons component when clicking "Delete"', fakeAsync(() => {
      const currentPath = location.path();
      expandSplitButton();
      const deleteButton: HTMLLIElement = fixture.nativeElement.querySelector('#list-lessons-deleteAction-0');
      deleteButton.click();
      tick();

      expect(location.path()).toBe(currentPath);
    }));

    xit('should navigate to listVocabularies component when clicking "Vocabulary"', fakeAsync(() => {
      expandSplitButton();
      const vocabulariesButton: HTMLLIElement = fixture.nativeElement.querySelector('#list-lessons-vocabularyAction-0');
      vocabulariesButton.click();
      tick();

      expect(location.path()).toBe(`/${frontend.lessons}/${component.lessons[0].id}/${frontend.vocabulary}`, 'should nav to listVocabularies for first lesson');
    }));

    it('should navigate to quiz component when clicking "Quiz"', fakeAsync(() => {
      const splitButton: HTMLElement = fixture.nativeElement.querySelector('#list-lessons-quizAction-0');
      const quizButton: HTMLButtonElement = splitButton.querySelectorAll('button')[0];

      quizButton.click();
      tick();

      expect(location.path()).toBe(`/${frontend.lessons}/${component.lessons[0].id}/${frontend.quiz}`,
        'should nav to quiz for first lesson');
    }));
  });
});
