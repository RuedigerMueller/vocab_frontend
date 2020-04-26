import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClient } from '@angular/common/http';

import { ListLessonsComponent } from './list-lessons.component';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { LessonService } from '../lesson.service';

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

    TestBed.configureTestingModule({
      declarations: [ListLessonsComponent],
      imports: [
        HttpClientTestingModule,
        RouterTestingModule.withRoutes([]),
      ],
      providers: [
        { provide: LessonService, useValue: lessonService }
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

  it('should navigate to add-lesson component when clicking "Create"');
  it('should navigate to edit-lesson component when clicking "Edit"');
  it('should stay on list-lessons component when clicking "Delete"');
});
