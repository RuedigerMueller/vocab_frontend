import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListVocabularyComponent } from './list-vocabulary.component';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClient } from '@angular/common/http';
import { VocabularyService } from '../vocabulary.service';
import { LessonService } from 'src/app/lesson/lesson.service';
import { of } from 'rxjs';
import { lessonTestData } from 'test/lesson.testdata.spec';
import { vocabularyTestData } from 'test/vocabulary.testdata.spec';
import { Router } from '@angular/router';
import { frontend } from 'src/app/resource.identifiers';
import { TableModule, ButtonModule, SplitButtonModule, MenuModule } from '@fundamental-ngx/core';

const testLesson = lessonTestData[0];
const testVocabularyList = vocabularyTestData;

describe('ListVocabulariesComponent', () => {
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;

  let component: ListVocabularyComponent;
  let fixture: ComponentFixture<ListVocabularyComponent>;

  let getVocabularySpy;
  let getLessonsSpy;

  beforeEach(async(() => {
    const vocabularyService = jasmine.createSpyObj('VocabularyService', ['getLessonVocabulary']);
    getVocabularySpy = vocabularyService.getLessonVocabulary.and.returnValue(of(testVocabularyList));

    const lessonService = jasmine.createSpyObj('LessonService', ['getLesson']);
    getLessonsSpy = lessonService.getLesson.and.returnValue(of(testLesson));

    // const routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl']);

    TestBed.configureTestingModule({
      declarations: [ListVocabularyComponent],
      imports: [
        HttpClientTestingModule,
        RouterTestingModule.withRoutes([]),
        TableModule,
        ButtonModule,
        SplitButtonModule,
        MenuModule,
      ],
      providers: [
        { provide: VocabularyService, useValue: vocabularyService },
        { provide: LessonService, useValue: lessonService },
        // { provide: Router, useValue: routerSpy }
      ]
    })
      .compileComponents();

    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListVocabularyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('Test environment should be setup', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });
  });

  describe('UI elements should be displayed', () => {
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

    it('should have required actions', () => {
      let success = true;

      // ToDo: Check for "Delete" Action => Not a a native HTML element....
      const expectedActions = ['Create', 'Edit'];

      const appElement: HTMLElement = fixture.nativeElement;
      const actions: NodeListOf<HTMLElement> = appElement.querySelectorAll('button, li');

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

    describe('should display the content', () => {
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

      xit('should display a vocabulary with a dueDate as defined in second test data entry', () => {
        const index = 1; // second element defined in testLessons
        const appElement: HTMLElement = fixture.nativeElement;
        const tableCell = appElement.querySelector(`#list-vocabulary-dueDate-${index}`);
        expect(tableCell.textContent).toContain(testVocabularyList[index].dueDate);
      });
    });
  });

  xdescribe('Routing tests', () => {
    let router: Router;

    // Trigger component so it gets heroes and binds to them
    beforeEach(async(() => {
      router = fixture.debugElement.injector.get(Router);
      fixture.detectChanges(); // runs ngOnInit -> getVocabulary
      fixture.whenStable() // No need for the `lastPromise` hack!
        .then(() => fixture.detectChanges()); // bind to vocabulary
    }));

    xit('should navigate to add-vocabulary component when clicking "Create"', () => {
      const createButton: HTMLElement = fixture.nativeElement.querySelector('#list-vocabulary-createAction');
      createButton.click();

      const spy = router.navigateByUrl as jasmine.Spy;
      const navArgs = spy.calls.first().args[0];

      const id = component.lesson.id;
      expect(navArgs).toBe(`/${frontend.lessons}/${id}/${frontend.addVocabulary}`, 'should nav to addVocabulary');
    });

    xit('should navigate edit-vocabulary component when clicking "Edit"', () => {
      const editButton: HTMLElement = fixture.nativeElement.querySelector('#list-vocabulary-editAction-0');
      editButton.click();

      const spy = router.navigateByUrl as jasmine.Spy;
      const navArgs = spy.calls.first().args[0];

      const id = component.lesson.id;
      expect(navArgs).toBe(`/${frontend.lessons}/${id}/${frontend.editVocabulary}/${component.vocabulary[0].id}`, 'should nav to editLesson for first lesson');
    });

    it('should stay on list-vocabulary component when clicking "Delete"', () => {
      const deleteButton: HTMLElement = fixture.nativeElement.querySelector('#list-vocabulary-deleteAction-0');
      deleteButton.click();

      const spy = router.navigateByUrl as jasmine.Spy;
      expect(spy.calls.first()).toBeUndefined('should stay on vocabulary list');
    });
  });
});
