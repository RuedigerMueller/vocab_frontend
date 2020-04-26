import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddLessonComponent } from './add-lesson.component';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClient } from '@angular/common/http';
import { By } from '@angular/platform-browser';

describe('AddLessonComponent', () => {
  let component: AddLessonComponent;
  let fixture: ComponentFixture<AddLessonComponent>;

  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddLessonComponent ],
      imports: [
        ReactiveFormsModule,
        RouterTestingModule.withRoutes([]),
        HttpClientTestingModule,
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

  it('should have button "Create"', () => {
    const appElement: HTMLElement = fixture.nativeElement;
    const button = appElement.querySelector('button');
    expect(button.textContent).toContain('Create');
  });

  it('should navigate to list-lessons component when clicking "Create"');
});
