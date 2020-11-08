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
import { lessonTestData } from 'test/lesson.testdata.spec';
import { LessonService } from '../../services/lesson.service';
import { AddLessonComponent } from './add-lesson.component';

describe('AddLessonComponent', () => {
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;
  let location: Location;
  let router: Router;

  let component: AddLessonComponent;
  let fixture: ComponentFixture<AddLessonComponent>;

  let addLessonSpy: any;
  let canActivateSpy: any;
  const testAddLesson = lessonTestData[0];

  beforeEach(waitForAsync(() => {
    const lessonService: any = jasmine.createSpyObj('LessonService', ['createLesson']);
    addLessonSpy = lessonService.createLesson.and.returnValue(of(testAddLesson));

    const authGuardService: any = jasmine.createSpyObj('AuthGuardService', ['canActivate']);
    canActivateSpy = authGuardService.canActivate.and.returnValue(true);

    TestBed.configureTestingModule({
      declarations: [AddLessonComponent],
      imports: [
        ReactiveFormsModule,
        RouterTestingModule.withRoutes(routes),
        HttpClientTestingModule,
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
    fixture = TestBed.createComponent(AddLessonComponent);
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

      const expectedLabels = ['Title', 'Learned language', 'Known language'];

      const appElement: HTMLElement = fixture.nativeElement;
      const labels: NodeListOf<HTMLLabelElement> = appElement.querySelectorAll('label');

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

    it('should have input field for "Title"', () => {
      const input: DebugElement = fixture.debugElement.query(By.css('#add-lesson-title'));
      const inputElement: any = input.nativeElement;
      expect(inputElement.value).toBe('');
    });

    it('should have input field for "Learned Language"', () => {
      const input: DebugElement = fixture.debugElement.query(By.css('#add-lesson-language_a'));
      const inputElement: any = input.nativeElement;
      expect(inputElement.value).toBe('');
    });

    it('should have input field for "Known Language"', () => {
      const input: DebugElement = fixture.debugElement.query(By.css('#add-lesson-language_b'));
      const inputElement: any = input.nativeElement;
      expect(inputElement.value).toBe('');
    });
  });

  describe('should have required actions', () => {
    it('should have button "Create"', () => {
      const button: HTMLButtonElement = fixture.nativeElement.querySelector('#add-lesson-createButton');
      expect(button.textContent).toContain('Create');
    });

    it('should have button "Cancel"', () => {
      const button: HTMLButtonElement = fixture.nativeElement.querySelector('#add-lesson-cancelButton');
      expect(button.textContent).toContain('Cancel');
    });
  });

  describe('should route correctly on actions', () => {
    it('should navigate to list-lessons component when clicking "Create"', fakeAsync(() => {
      const createButton: HTMLButtonElement = fixture.nativeElement.querySelector('#add-lesson-createButton');
      createButton.click();
      tick();

      expect(location.path()).toBe(`/${frontend.lessons}`, 'should nav to listLessons');
    }));

    it('should navigate to list-lessons component when clicking "Cancel"', fakeAsync(() => {
      const cancelButton: HTMLButtonElement = fixture.nativeElement.querySelector('#add-lesson-cancelButton');
      cancelButton.click();
      tick();

      expect(location.path()).toBe(`/${frontend.lessons}`, 'should nav to listLessons');
    }));
  });

  describe('should support keyboard navigation', () => {
    it('lesson title should have autofocus', () => {
      const inputDE: DebugElement = fixture.debugElement.query(By.css('#add-lesson-title'));
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
