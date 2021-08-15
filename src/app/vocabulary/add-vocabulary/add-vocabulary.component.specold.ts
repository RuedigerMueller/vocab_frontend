import { Location } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { DebugElement } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { ButtonModule, FormModule } from '@fundamental-ngx/core';
import { of } from 'rxjs';
import { routes } from 'src/app/app-routing.module';
import { AuthGuardService } from 'src/app/helpers/auth-guard.service';
import { Lesson } from 'src/app/models/lesson.model.';
import { LessonService } from 'src/app/services/lesson.service';
import { lessonTestData } from 'test/lesson.testdata.spec';
import { vocabularyTestData } from 'test/vocabulary.testdata.spec';
import { Vocabulary } from '../../models/vocabulary.model';
import { VocabularyService } from '../../services/vocabulary.service';
import { AddVocabularyComponent } from './add-vocabulary.component';
import { provideMockStore, MockStore } from '@ngrx/store/testing';

xdescribe('AddVocabularyComponent', () => {
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;
  let location: Location;
  let router: Router;

  let component: AddVocabularyComponent;
  let fixture: ComponentFixture<AddVocabularyComponent>;

  let getLessonsSpy: any;
  let createVocabularySpy: any;
  let canActivateSpy: any;

  const testLesson: Lesson = lessonTestData[0];
  const testVocabulary: Vocabulary = vocabularyTestData[0];

  let store: MockStore;
  const initialState =  {
    lessons: [],
    error: ''
  };

  beforeEach(waitForAsync(() => {
    const lessonService: any = jasmine.createSpyObj('LessonService', ['getLesson']);
    getLessonsSpy = lessonService.getLesson.and.returnValue(of(testLesson));

    const vocabularyService: any = jasmine.createSpyObj('VocabularyService', ['createVocabulary']);
    createVocabularySpy = vocabularyService.createVocabulary.and.returnValue(of(testVocabulary));

    const authGuardService: any = jasmine.createSpyObj('AuthGuardService', ['canActivate']);
    canActivateSpy = authGuardService.canActivate.and.returnValue(true);

    TestBed.configureTestingModule({
      declarations: [AddVocabularyComponent],
      imports: [
        ReactiveFormsModule,
        HttpClientTestingModule,
        RouterTestingModule.withRoutes(routes),
        ButtonModule,
        FormModule,
      ],
      providers: [
        provideMockStore( {initialState }),
        { provide: LessonService, useValue: lessonService },
        { provide: VocabularyService, useValue: vocabularyService },
        { provide: AuthGuardService, useValue: authGuardService },
      ]
    })
      .compileComponents();

    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
    store = TestBed.inject(MockStore);
  }));

  beforeEach(() => {
    router = TestBed.inject(Router);
    location = TestBed.inject(Location);
    fixture = TestBed.createComponent(AddVocabularyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('should create component', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });
  });

  xdescribe('should render UI elements', () => {
    it('should have the required labels', () => {
      let success = true;

      const expectedLabels: ReadonlyArray<string> = [testLesson.language_a, testLesson.language_b];

      const labels: NodeListOf<HTMLLabelElement> = fixture.nativeElement.querySelectorAll('label');

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

    it('should have "Learned Language" input field filled', () => {
      const input: DebugElement = fixture.debugElement.query(By.css('#add-vocabulary-language_a'));
      const inputElement: any = input.nativeElement;
      expect(inputElement.value).toBe('');
    });

    it('should have "Known Language" input field filled', () => {
      const input: DebugElement = fixture.debugElement.query(By.css('#add-vocabulary-language_b'));
      const inputElement: any = input.nativeElement;
      expect(inputElement.value).toBe('');
    });
  });

  xdescribe('should have required actions', () => {
    it('should have button "Add"', () => {
      const button: HTMLButtonElement = fixture.nativeElement.querySelector('#add-vocabulary-addButton');
      expect(button.textContent).toContain('Add');
    });

    it('should have button "Cancel"', () => {
      const button: HTMLButtonElement = fixture.nativeElement.querySelector('#add-vocabulary-cancelButton');
      expect(button.textContent).toContain('Cancel');
    });
  });

  xdescribe('should route correctly on actions', () => {
    it('should stay on add-vocabulary when clicking "Add"', fakeAsync(() => {
      const currentLocation: string = location.path();
      const addButton: HTMLButtonElement = fixture.nativeElement.querySelector('#add-vocabulary-addButton');
      addButton.click();
      tick();

      expect(location.path()).toBe(currentLocation, 'should stay on addVocabulary');
    }));

    xit('should navigate to list-vocabulary component when clicking "Cancel"', fakeAsync(() => {
      /* const cancelButton: HTMLButtonElement = fixture.nativeElement.querySelector('#add-vocabulary-cancelButton');
      cancelButton.click();
      tick();

      expect(location.path()).toBe(`/${frontend.lessons}/${component.lesson.id}/${frontend.vocabulary}`, 'should nav to listVocabulary'); */
    }));
  });

  xdescribe('should support keyboard navigation', () => {
    it('language_a should have autofocus', () => {
      const inputDE: DebugElement = fixture.debugElement.query(By.css('#add-vocabulary-language_a'));
      const inputElement: HTMLInputElement = inputDE.nativeElement;
      expect (inputElement.autofocus).toBeTrue();
    });

    it('should have focus on add-vocabulary-language_a field after clicking "Add"', fakeAsync(() => {
      const inputDE: DebugElement = fixture.debugElement.query(By.css('#add-vocabulary-language_a'));
      const inputElement: HTMLLinkElement = inputDE.nativeElement;
      spyOn(inputElement, 'focus');

      const addButton: HTMLButtonElement = fixture.nativeElement.querySelector('#add-vocabulary-addButton');
      addButton.click();
      tick();

      expect(inputElement.focus).toHaveBeenCalled();
    }));

    it('should only have one autofocus element', () => {
      const items: ReadonlyArray<HTMLElement> = fixture.nativeElement.getElementsByTagName('*');
      let counter = 0;
      for (let i = items.length; i--;) {
        if (items[i].autofocus === true) { counter++; }
      }
      expect(counter).toEqual(1);
    });
  });
});
