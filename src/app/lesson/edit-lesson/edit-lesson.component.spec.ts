import { Location } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { DebugElement } from '@angular/core';
import { async, ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { ButtonModule, FormModule } from '@fundamental-ngx/core';
import { of } from 'rxjs';
import { routes } from 'src/app/app-routing.module';
import { AuthGuardService } from 'src/app/helpers/auth-guard.service';
import { frontend } from 'src/app/resource.identifiers';
import { lessonTestData } from 'test/lesson.testdata.spec';
import { LessonService } from '../../services/lesson.service';
import { EditLessonComponent } from './edit-lesson.component';

describe('EditLessonComponent', () => {
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;
  let location: Location;
  let router: Router;

  let component: EditLessonComponent;
  let fixture: ComponentFixture<EditLessonComponent>;

  let getLessonSpy: any;
  let updateLessonSpy: any;
  let canActivateSpy: any;

  const testEditLesson = lessonTestData[0];

  beforeEach(waitForAsync(() => {
    const lessonService: any = jasmine.createSpyObj('LessonService', ['getLesson', 'updateLesson']);
    getLessonSpy = lessonService.getLesson.and.returnValue(of(testEditLesson));
    updateLessonSpy = lessonService.updateLesson.and.returnValue(of(testEditLesson));

    const authGuardService: any = jasmine.createSpyObj('AuthGuardService', ['canActivate']);
    canActivateSpy = authGuardService.canActivate.and.returnValue(true);

    TestBed.configureTestingModule({
      declarations: [EditLessonComponent],
      imports: [
        ReactiveFormsModule,
        HttpClientTestingModule,
        RouterTestingModule.withRoutes(routes),
        ButtonModule,
        FormModule
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
    fixture = TestBed.createComponent(EditLessonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('should create component', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });
  });

  describe('should render UI elements', () => {
    it('should have the required labels', () => {
      let success = true;

      const expectedLabels: ReadonlyArray<string> = ['Title', 'Learned language', 'Known language'];

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

    it('should have "Title" input field filled', () => {
      const input: DebugElement = fixture.debugElement.query(By.css('#edit-lesson-title'));
      const inputElement: any = input.nativeElement;
      expect(inputElement.value).toBe(testEditLesson.title);
      expect(getLessonSpy.calls.any()).toBe(true, 'getLesson called');
    });

    it('should have "Learned Language" input field filled', () => {
      const input: DebugElement = fixture.debugElement.query(By.css('#edit-lesson-language_a'));
      const inputElement: any = input.nativeElement;
      expect(inputElement.value).toContain(testEditLesson.language_a);
      expect(getLessonSpy.calls.any()).toBe(true, 'getLesson called');
    });

    it('should have "Known Language" input field filled', () => {
      const input: DebugElement = fixture.debugElement.query(By.css('#edit-lesson-language_b'));
      const inputElement: any = input.nativeElement;
      expect(inputElement.value).toContain(testEditLesson.language_b);
      expect(getLessonSpy.calls.any()).toBe(true, 'getLesson called');
    });
  });

  describe('should have required actions', () => {
    it('should have button "Save"', () => {
      const button: HTMLButtonElement = fixture.nativeElement.querySelector('#edit-lesson-saveButton');
      expect(button.textContent).toContain('Save');
    });

    it('should have button "Cancel"', () => {
      const button: HTMLButtonElement = fixture.nativeElement.querySelector('#edit-lesson-cancelButton');
      expect(button.textContent).toContain('Cancel');
    });
  });

  describe('should route correctly on actions', () => {
    it('should navigate to list-lessons component when clicking "Save"', fakeAsync(() => {
      const saveButton: HTMLButtonElement = fixture.nativeElement.querySelector('#edit-lesson-saveButton');
      saveButton.click();
      tick();

      expect(location.path()).toBe(`/${frontend.lessons}`, 'should nav to listLessons');
    }));

    it('should navigate to list-lessons component when clicking "Cancel"', fakeAsync(() => {
      const cancelButton: HTMLButtonElement = fixture.nativeElement.querySelector('#edit-lesson-cancelButton');
      cancelButton.click();
      tick();

      expect(location.path()).toBe(`/${frontend.lessons}`, 'should nav to listLessons');
    }));
  });

  describe('should support keyboard navigation', () => {
    it('lesson title should have autofocus', () => {
      const inputDE: DebugElement = fixture.debugElement.query(By.css('#edit-lesson-title'));
      const inputElement: HTMLInputElement = inputDE.nativeElement;
      expect (inputElement.autofocus).toBeTrue();
    });

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
