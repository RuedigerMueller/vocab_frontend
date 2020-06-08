import { Location } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { ButtonModule, MenuModule, SplitButtonModule, TableModule } from '@fundamental-ngx/core';
import { Observable, of } from 'rxjs';
import { routes } from 'src/app/app-routing.module';
import { LessonService } from 'src/app/services/lesson.service';
import { Lesson } from 'src/app/models/lesson.model.';
import { frontend } from 'src/app/resource.identifiers';
import { lessonTestData } from 'test/lesson.testdata.spec';
import { vocabularyTestData } from 'test/vocabulary.testdata.spec';
import { VocabularyService } from '../../services/vocabulary.service';
import { Vocabulary } from '../../models/vocabulary.model';
import { ListVocabularyComponent } from './list-vocabulary.component';
import { AuthGuardService } from 'src/app/helpers/auth-guard.service';



describe('ListVocabulariesComponent', () => {
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;
  let location: Location;
  let router: Router;

  let component: ListVocabularyComponent;
  let fixture: ComponentFixture<ListVocabularyComponent>;

  let getVocabularySpy: any;
  let deleteVocabularySpy: any;
  let getLessonsSpy: any;
  let canActivateSpy: any;

  const testLesson: Lesson = lessonTestData[0];
  const testVocabularyList: ReadonlyArray<Vocabulary> = vocabularyTestData;

  const expandSplitButton = () => {
    const expandableButton: HTMLButtonElement = fixture.nativeElement.querySelector('.sap-icon--slim-arrow-down');
    expandableButton.click();
    fixture.detectChanges();
  };

  beforeEach(async(() => {
    const vocabularyService: any = jasmine.createSpyObj('VocabularyService', ['getLessonVocabulary', 'deleteVocabulary']);
    getVocabularySpy = vocabularyService.getLessonVocabulary.and.returnValue(of(testVocabularyList));
    deleteVocabularySpy = vocabularyService.deleteVocabulary.and.returnValue(new Observable<void>());

    const lessonService: any = jasmine.createSpyObj('LessonService', ['getLesson']);
    getLessonsSpy = lessonService.getLesson.and.returnValue(of(testLesson));

    const authGuardService: any = jasmine.createSpyObj('AuthGuardService', ['canActivate']);
    canActivateSpy = authGuardService.canActivate.and.returnValue(true);

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
        { provide: AuthGuardService, useValue: authGuardService },
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

      const expectedColumns: ReadonlyArray<string> = [testLesson.language_a, testLesson.language_b, 'Level', 'Due Date', 'Actions'];

      const tableHeaders: NodeListOf<HTMLTableHeaderCellElement> = fixture.nativeElement.querySelectorAll('th');

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
      const tableCell: HTMLTableCellElement = fixture.nativeElement.querySelector(`#list-vocabulary-language_a-${index}`);
      expect(tableCell.textContent).toContain(testVocabularyList[index].language_a);
    });

    it('should display a vocabulary with a lanaguage_b as defined in second test data entry', () => {
      const index = 1; // second element defined in testLessons
      const tableCell: HTMLTableCellElement = fixture.nativeElement.querySelector(`#list-vocabulary-language_b-${index}`);
      expect(tableCell.textContent).toContain(testVocabularyList[index].language_b);
    });

    it('should display a vocabulary with a level as defined in second test data entry', () => {
      const index = 1; // second element defined in testLessons
      const tableCell: HTMLTableCellElement = fixture.nativeElement.querySelector(`#list-vocabulary-level-${index}`);
      expect(tableCell.textContent).toContain(testVocabularyList[index].level.toString());
    });

    it('should display a vocabulary with a dueDate as defined in second test data entry', () => {
      const index = 1; // second element defined in testLessons
      const tableCell: HTMLTableCellElement = fixture.nativeElement.querySelector(`#list-vocabulary-dueDate-${index}`);

      const dueDate: Date = new Date(testVocabularyList[index].dueDate);
      expect(tableCell.textContent).toContain(dueDate.toLocaleDateString('en-US', { year: '2-digit', month: 'numeric', day: 'numeric' }));
    });
  });

  describe('should have required actions', () => {
    it('should have required buttons', () => {
      let success = true;

      const expectedActions: ReadonlyArray<string> = ['Create', 'Close Lesson', 'Edit'];

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
      expect(getVocabularySpy.calls.any()).toBe(true, 'getVocabulary called');
    });

    it('should have the required actions as part of the split button', () => {
      let success = true;

      expandSplitButton();

      const expectedActions: ReadonlyArray<string> = ['Delete'];
      const actions: NodeListOf<HTMLLIElement> = fixture.nativeElement.querySelectorAll('li');

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
      const createButton: HTMLButtonElement = fixture.nativeElement.querySelector('#list-vocabulary-createAction');
      createButton.click();
      tick();

      expect(location.path()).toBe(`/${frontend.lessons}/${component.lesson.id}/${frontend.addVocabulary}`);
    }));

    it('should navigate to list-lessons component when clicking "Close Lesson"', fakeAsync(() => {
      const createButton: HTMLButtonElement = fixture.nativeElement.querySelector('#list-vocabulary-closeLessonAction');
      createButton.click();
      tick();

      expect(location.path()).toBe(`/${frontend.lessons}`);
    }));

    it('should navigate edit-vocabulary component when clicking "Edit"', fakeAsync(() => {
      const splitButton: HTMLElement = fixture.nativeElement.querySelector('#list-vocabulary-editAction-0');
      const editButton: HTMLButtonElement = splitButton.querySelectorAll('button')[0];
      editButton.click();
      tick();

      expect(location.path()).toBe(`/${frontend.lessons}/${component.lesson.id}/${frontend.editVocabulary}/${component.vocabulary[0].id}`, 'should nav to editLesson for first lesson');
    }));

    it('should stay on list-vocabulary component when clicking "Delete"', fakeAsync(() => {
      const currentPath: string = location.path();
      expandSplitButton();
      const deleteButton: HTMLButtonElement = fixture.nativeElement.querySelector('#list-vocabulary-deleteAction-0');
      deleteButton.click();
      tick();

      expect(location.path()).toBe(currentPath, 'should stay on vocabulary list');
    }));
  });
});
