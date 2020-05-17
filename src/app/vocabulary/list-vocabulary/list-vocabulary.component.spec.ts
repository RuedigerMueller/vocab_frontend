import { Location } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { ButtonModule, MenuModule, SplitButtonModule, TableModule } from '@fundamental-ngx/core';
import { Observable, of } from 'rxjs';
import { routes } from 'src/app/app-routing.module';
import { LessonService } from 'src/app/lesson/lesson.service';
import { Lesson } from 'src/app/lesson/lesson.service.interface';
import { frontend } from 'src/app/resource.identifiers';
import { lessonTestData } from 'test/lesson.testdata.spec';
import { vocabularyTestData } from 'test/vocabulary.testdata.spec';
import { VocabularyService } from '../vocabulary.service';
import { ListVocabularyComponent } from './list-vocabulary.component';


const testLesson: Lesson = lessonTestData[0];
const testVocabularyList = vocabularyTestData;

describe('ListVocabulariesComponent', () => {
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;
  let location: Location;
  let router: Router;

  let component: ListVocabularyComponent;
  let fixture: ComponentFixture<ListVocabularyComponent>;

  let getVocabularySpy;
  let deleteVocabularySpy;
  let getLessonsSpy;

  const expandSplitButton = () => {
    const appElement: HTMLElement = fixture.nativeElement;
    const expandableButton: HTMLElement = appElement.querySelector('.sap-icon--slim-arrow-down');
    expandableButton.click();
    fixture.detectChanges();
  };

  beforeEach(async(() => {
    const vocabularyService = jasmine.createSpyObj('VocabularyService', ['getLessonVocabulary', 'deleteVocabulary']);
    getVocabularySpy = vocabularyService.getLessonVocabulary.and.returnValue(of(testVocabularyList));
    deleteVocabularySpy = vocabularyService.deleteVocabulary.and.returnValue(new Observable<void>());

    const lessonService = jasmine.createSpyObj('LessonService', ['getLesson']);
    getLessonsSpy = lessonService.getLesson.and.returnValue(of(testLesson));

    TestBed.configureTestingModule({
      declarations: [ListVocabularyComponent],
      imports: [
        HttpClientTestingModule,
        RouterTestingModule.withRoutes(routes),
        TableModule,
        ButtonModule,
        SplitButtonModule,
        MenuModule,
      ],
      providers: [
        { provide: VocabularyService, useValue: vocabularyService },
        { provide: LessonService, useValue: lessonService },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: convertToParamMap({
                lessonID: testLesson.id
              })
            }
          }
        },
      ]
    })
      .compileComponents();

    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
  }));

  beforeEach(() => {
    router = TestBed.inject(Router);
    location = TestBed.inject(Location);
    fixture = TestBed.createComponent(ListVocabularyComponent);
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

      const expectedColumns = [testLesson.language_a, testLesson.language_b, 'Level', 'Due Date', 'Actions'];

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
      expect(getVocabularySpy.calls.any()).toBe(true, 'getVocabulary called');
      expect(getLessonsSpy.calls.any()).toBe(true, 'getLessons called');
    });

    it('should display a vocabulary with a lanaguage_a as defined in second test data entry', () => {
      const index = 1; // second element defined in testLessons
      const appElement: HTMLElement = fixture.nativeElement;
      const tableCell = appElement.querySelector(`#list-vocabulary-language_a-${index}`);
      expect(tableCell.textContent).toContain(testVocabularyList[index].language_a);
    });

    it('should display a vocabulary with a lanaguage_b as defined in second test data entry', () => {
      const index = 1; // second element defined in testLessons
      const appElement: HTMLElement = fixture.nativeElement;
      const tableCell = appElement.querySelector(`#list-vocabulary-language_b-${index}`);
      expect(tableCell.textContent).toContain(testVocabularyList[index].language_b);
    });

    it('should display a vocabulary with a level as defined in second test data entry', () => {
      const index = 1; // second element defined in testLessons
      const appElement: HTMLElement = fixture.nativeElement;
      const tableCell = appElement.querySelector(`#list-vocabulary-level-${index}`);
      expect(tableCell.textContent).toContain(testVocabularyList[index].level.toString());
    });

    it('should display a vocabulary with a dueDate as defined in second test data entry', () => {
      const index = 1; // second element defined in testLessons
      const appElement: HTMLElement = fixture.nativeElement;
      const tableCell = appElement.querySelector(`#list-vocabulary-dueDate-${index}`);

      const dueDate: Date = new Date(testVocabularyList[index].dueDate);
      expect(tableCell.textContent).toContain(dueDate.toLocaleDateString('en-US', { year: '2-digit', month: 'numeric', day: 'numeric' }));
    });
  });

  describe('should have required actions', () => {
    it('should have required buttons', () => {
      let success = true;

      const expectedActions = ['Create', 'Edit'];

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
      expect(getVocabularySpy.calls.any()).toBe(true, 'getVocabulary called');
    });

    it('should have the required actions as part of the split button', () => {
      let success = true;

      expandSplitButton();

      const appElement: HTMLElement = fixture.nativeElement;
      const expectedActions = ['Delete'];
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
    it('should navigate to add-vocabulary component when clicking "Create"', fakeAsync(() => {
      const createButton: HTMLElement = fixture.nativeElement.querySelector('#list-vocabulary-createAction');
      createButton.click();
      tick();

      const id = component.lesson.id;
      expect(location.path()).toBe(`/${frontend.lessons}/${id}/${frontend.addVocabulary}`);
    }));

    it('should navigate edit-vocabulary component when clicking "Edit"', fakeAsync(() => {
      const splitButton: HTMLElement = fixture.nativeElement.querySelector('#list-vocabulary-editAction-0');
      const editButton: HTMLElement = splitButton.querySelectorAll('button')[0];
      editButton.click();
      tick();

      const id = component.lesson.id;
      expect(location.path()).toBe(`/${frontend.lessons}/${id}/${frontend.editVocabulary}/${component.vocabulary[0].id}`, 'should nav to editLesson for first lesson');
    }));

    it('should stay on list-vocabulary component when clicking "Delete"', fakeAsync(() => {
      const currentPath = location.path();
      expandSplitButton();
      const deleteButton: HTMLElement = fixture.nativeElement.querySelector('#list-vocabulary-deleteAction-0');
      deleteButton.click();
      tick();

      expect(location.path()).toBe(currentPath, 'should stay on vocabulary list');
    }));
  });
});
