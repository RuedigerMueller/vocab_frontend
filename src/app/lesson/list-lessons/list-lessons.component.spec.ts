import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClient } from '@angular/common/http';

import { ListLessonsComponent } from './list-lessons.component';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { LessonService } from '../lesson.service';
import { Router } from '@angular/router';

const testLessonList = [
  {
    id: 2,
    user: 'User1',
    title: 'Unit 2',
    language_a: 'English',
    language_b: 'Deutsch',
    numberVocables: 30,
    numberDueVocables: 2
  },
  {
    id: 4,
    user: 'User1',
    title: 'Unidad 1',
    language_a: 'Español',
    language_b: 'Deutsch',
    vocabularies: [],
    numberVocables: 0,
    numberDueVocables: 0
  },
  {
    id: 5,
    user: 'User1',
    title: 'Unidad 1',
    language_a: 'Español',
    language_b: 'Deutsch',
    vocabularies: [],
    numberVocables: 0,
    numberDueVocables: 0
  },
];

describe('ListLessonsComponent', () => {
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;

  let component: ListLessonsComponent;
  let fixture: ComponentFixture<ListLessonsComponent>;

  let getLessonsSpy;

  beforeEach(async(() => {
    const lessonService = jasmine.createSpyObj('LessonService', ['getLessons']);
    getLessonsSpy = lessonService.getLessons.and.returnValue(of(testLessonList));
    const routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl']);

    TestBed.configureTestingModule({
      declarations: [ListLessonsComponent],
      imports: [
        HttpClientTestingModule,
        RouterTestingModule.withRoutes([]),
      ],
      providers: [
        { provide: LessonService, useValue: lessonService },
        { provide: Router, useValue: routerSpy }
      ]
    })
      .compileComponents();

    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListLessonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have the required column heading', () => {
    let success = true;

    const expectedColumns = ['Title', 'Language', '#Vocabularies', '#Due Vocabularies', 'Actions'];

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

  it('should have required buttons', () => {
    let success = true;

    const expectedButtons = ['Create', 'Edit', 'Delete'];

    const appElement: HTMLElement = fixture.nativeElement;
    const buttons = appElement.querySelectorAll('button');

    for (const expectedButton of expectedButtons) {
      let found = false;
      buttons.forEach((button) => {
        if (button.textContent === expectedButton) {
          found = true;
        }
      });

      if (found === false) {
        success = false;
        expect(found).toBeTruthy(`Button ${expectedButton} not found`);
      }
    }
    expect(success).toBeTruthy('All expected buttons rendered');
    expect(getLessonsSpy.calls.any()).toBe(true, 'getLessons called');
  });

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

  describe('routing tests', () => {
    let router: Router;

    // Trigger component so it gets heroes and binds to them
    beforeEach(async(() => {
      router = fixture.debugElement.injector.get(Router);
      fixture.detectChanges(); // runs ngOnInit -> getLessons
      fixture.whenStable() // No need for the `lastPromise` hack!
        .then(() => fixture.detectChanges()); // bind to lessons
    }));

    it('should navigate to add-lesson component when clicking "Create"', () => {
      const createButton: HTMLElement = fixture.nativeElement.querySelector('#list-lessons-createButton');
      createButton.click();

      const spy = router.navigateByUrl as jasmine.Spy;
      const navArgs = spy.calls.first().args[0];

      expect(navArgs).toBe('/createLesson',
        'should nav to createLesson');
    });

    it('should navigate to edit-lesson component when clicking "Edit"', () => {
      const editButton: HTMLElement = fixture.nativeElement.querySelector('#list-lessons-editButton-0');
      editButton.click();

      const spy = router.navigateByUrl as jasmine.Spy;
      const navArgs = spy.calls.first().args[0];

      const id = component.lessons[0].id;
      expect(navArgs).toBe('/editLesson/' + id,
        'should nav to editLesson for first lesson');
    });

    it('should stay on list-lessons component when clicking "Delete"', () => {
      const deleteButton: HTMLElement = fixture.nativeElement.querySelector('#list-lessons-deleteButton-0');
      deleteButton.click();

      const spy = router.navigateByUrl as jasmine.Spy;
      expect(spy.calls.first()).toBeUndefined('should stay on lessons list');
    });
  });
});
