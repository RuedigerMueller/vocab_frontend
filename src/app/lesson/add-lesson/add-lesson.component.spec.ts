import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddLessonComponent } from './add-lesson.component';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClient } from '@angular/common/http';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';

import { ButtonModule, FormModule } from '@fundamental-ngx/core';

describe('AddLessonComponent', () => {
  let component: AddLessonComponent;
  let fixture: ComponentFixture<AddLessonComponent>;

  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;

  beforeEach(async(() => {
    const routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl']);
    TestBed.configureTestingModule({
      declarations: [AddLessonComponent],
      imports: [
        ReactiveFormsModule,
        RouterTestingModule.withRoutes([]),
        HttpClientTestingModule,
        ButtonModule,
        FormModule
      ],
      providers: [
        { provide: Router, useValue: routerSpy }
      ]
    })
      .compileComponents();

    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddLessonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have the required labels', () => {
    let success = true;

    const expectedLabels = ['Title', 'Learned language', 'Known language'];

    const appElement: HTMLElement = fixture.nativeElement;
    const labels = appElement.querySelectorAll('label');

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

  describe('should have the required input fields', () => {
    it('should have input field for "Title"', () => {
      const input = fixture.debugElement.query(By.css('#add-lesson-title'));
      const inputElement = input.nativeElement;
      expect(inputElement.value).toBe('');
    });

    it('should have input field for "Learned Language"', () => {
      const input = fixture.debugElement.query(By.css('#add-lesson-language_a'));
      const inputElement = input.nativeElement;
      expect(inputElement.value).toBe('');
    });

    it('should have input field for "Known Language"', () => {
      const input = fixture.debugElement.query(By.css('#add-lesson-language_b'));
      const inputElement = input.nativeElement;
      expect(inputElement.value).toBe('');
    });
  });

  describe('should have the required actioms', () => {
    it('should have button "Create"', () => {
      const appElement: HTMLElement = fixture.nativeElement;
      const button = appElement.querySelector('#add-lesson-createButton');
      expect(button.textContent).toContain('Create');
    });

    it('should have button "Cancel"', () => {
      const appElement: HTMLElement = fixture.nativeElement;
      const button = appElement.querySelector('#add-lesson-cancelButton');
      expect(button.textContent).toContain('Cancel');
    });
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

    xit('should navigate to list-lessons component when clicking "Create"', () => {
      const createButton: HTMLElement = fixture.nativeElement.querySelector('#add-lesson-createButton');
      createButton.click();

      const spy = router.navigateByUrl as jasmine.Spy;
      const navArgs = spy.calls.first().args[0];

      expect(navArgs).toBe('/lessons', 'should nav to lessons after create');
    });

    xit('should navigate to list-lessons component when clicking "Cancel"', () => {
      const createButton: HTMLElement = fixture.nativeElement.querySelector('#add-lesson-createButton');
      createButton.click();

      const spy = router.navigateByUrl as jasmine.Spy;
      const navArgs = spy.calls.first().args[0];

      expect(navArgs).toBe('/lessons', 'should nav to lessons after cancel');
    });
  });
});

