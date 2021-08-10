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
import { frontend } from 'src/app/resource.identifiers';
import { LessonService } from 'src/app/services/lesson.service';
import { lessonTestData } from 'test/lesson.testdata.spec';
import { vocabularyTestData } from 'test/vocabulary.testdata.spec';
import { VocabularyService } from '../../services/vocabulary.service';
import { EditVocabularyComponent } from './edit-vocabulary.component';

describe('EditVocabularyComponent', () => {
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;
  let location: Location;
  let router: Router;

  let component: EditVocabularyComponent;
  let fixture: ComponentFixture<EditVocabularyComponent>;

  let getVocabularySpy: any;
  let updateVocabularySpy: any;
  let getLessonsSpy: any;
  let canActivateSpy: any;

  const testLesson = lessonTestData[0];
  const testVocabularyList = vocabularyTestData;

  beforeEach(waitForAsync(() => {
    const vocabularyService: any = jasmine.createSpyObj('VocabularyService', ['getVocabulary', 'updateVocabulary']);
    getVocabularySpy = vocabularyService.getVocabulary.and.returnValue(of(testVocabularyList[0]));
    updateVocabularySpy = vocabularyService.updateVocabulary.and.returnValue(of(testVocabularyList[0]));

    const lessonService: any = jasmine.createSpyObj('LessonService', ['getLesson']);
    getLessonsSpy = lessonService.getLesson.and.returnValue(of(testLesson));

    const authGuardService: any = jasmine.createSpyObj('AuthGuardService', ['canActivate']);
    canActivateSpy = authGuardService.canActivate.and.returnValue(true);

    TestBed.configureTestingModule({
      declarations: [EditVocabularyComponent],
      imports: [
        ReactiveFormsModule,
        HttpClientTestingModule,
        RouterTestingModule.withRoutes(routes),
        ButtonModule,
        FormModule,
      ],
      providers: [
        { provide: VocabularyService, useValue: vocabularyService },
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
    fixture = TestBed.createComponent(EditVocabularyComponent);
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
      const input: DebugElement = fixture.debugElement.query(By.css('#edit-vocabulary-language_a'));
      const inputElement: any = input.nativeElement;
      expect(inputElement.value).toContain(testVocabularyList[0].language_a);
      expect(getVocabularySpy.calls.any()).toBe(true, 'getVocabulary called');
    });

    it('should have "Known Language" input field filled', () => {
      const input: DebugElement = fixture.debugElement.query(By.css('#edit-vocabulary-language_b'));
      const inputElement: any = input.nativeElement;
      expect(inputElement.value).toContain(testVocabularyList[0].language_b);
      expect(getVocabularySpy.calls.any()).toBe(true, 'getVocabulary called');
    });
  });

  xdescribe('should have required actions', () => {
    it('should have button "Save"', () => {
      const button: HTMLButtonElement = fixture.nativeElement.querySelector('#edit-vocabulary-saveButton');
      expect(button.textContent).toContain('Save');
    });

    it('should have button "Cancel"', () => {
      const button: HTMLButtonElement = fixture.nativeElement.querySelector('#edit-vocabulary-cancelButton');
      expect(button.textContent).toContain('Cancel');
    });
  });

  xdescribe('should route correctly on actions', () => {
    xit('should navigate to list-lessons component when clicking "Save"', fakeAsync(() => {
      /* const saveButton: HTMLButtonElement = fixture.nativeElement.querySelector('#edit-vocabulary-saveButton');
      saveButton.click();
      tick();

      expect(location.path()).toBe(`/${frontend.lessons}/${component.lesson.id}/${frontend.vocabulary}`, 'should nav to listVocabulary'); */
    }));

    xit('should navigate to list-lessons component when clicking "Cancel"', fakeAsync(() => {
      /* const cancelButton: HTMLButtonElement = fixture.nativeElement.querySelector('#edit-vocabulary-cancelButton');
      cancelButton.click();
      tick();

      expect(location.path()).toBe(`/${frontend.lessons}/${component.lesson.id}/${frontend.vocabulary}`, 'should nav to listVocabulary'); */
    }));
  });

  xdescribe('should support keyboard navigation', () => {
    it('languaga_a should have autofocus', () => {
      const inputDE: DebugElement = fixture.debugElement.query(By.css('#edit-vocabulary-language_a'));
      const inputElement: HTMLInputElement = inputDE.nativeElement;
      expect (inputElement.autofocus).toBeTrue();
    });
  });
});
