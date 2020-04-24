import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClient } from '@angular/common/http';

import { ListLessonsComponent } from './list-lessons.component';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

describe('ListLessonsComponent', () => {
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;

  let component: ListLessonsComponent;
  let fixture: ComponentFixture<ListLessonsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ListLessonsComponent],
      imports: [
        HttpClientTestingModule,
        RouterTestingModule.withRoutes([]),
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

  it('should have "Title" column heading', async () => {
    await fixture.whenStable();
    let success = false;
    const debugElements: ReadonlyArray<DebugElement> = fixture.debugElement.queryAll(By.css('th'));
    debugElements.forEach((de: DebugElement) => {
      const element: HTMLElement = de.nativeElement;
      if (element.textContent === 'Title'){
        success = true;
      }
    });
    expect(success).toBeTruthy();
  });

  it('should have 2 "Language " column  headinga', async() => {
    await fixture.whenStable();
    let count = 0;
    const debugElements: ReadonlyArray<DebugElement> = fixture.debugElement.queryAll(By.css('th'));
    debugElements.forEach((de: DebugElement) => {
      const element: HTMLElement = de.nativeElement;
      if (element.textContent === 'Language'){
        count++;
      }
    });
    expect(count).toBe(2);
  });

  it('should have "#Vocabluaries" column heading', async() => {
    await fixture.whenStable();
    let success = false;
    const debugElements: ReadonlyArray<DebugElement> = fixture.debugElement.queryAll(By.css('th'));
    debugElements.forEach((de: DebugElement) => {
      const element: HTMLElement = de.nativeElement;
      if (element.textContent === '#Vocabluaries'){
        success = true;
      }
    });
    expect(success).toBeTruthy();
  });

  it('should have "#Due Vocabluaries" column heading', async() => {
    await fixture.whenStable();
    let success = false;
    const debugElements: ReadonlyArray<DebugElement> = fixture.debugElement.queryAll(By.css('th'));
    debugElements.forEach((de: DebugElement) => {
      const element: HTMLElement = de.nativeElement;
      if (element.textContent === '#Due Vocabluaries'){
        success = true;
      }
    });
    expect(success).toBeTruthy();
  });

  it('should have "Actions" column heading', async() => {
    await fixture.whenStable();
    let success = false;
    const debugElements: ReadonlyArray<DebugElement> = fixture.debugElement.queryAll(By.css('th'));
    debugElements.forEach((de: DebugElement) => {
      const element: HTMLElement = de.nativeElement;
      if (element.textContent === 'Actions'){
        success = true;
      }
    });
    expect(success).toBeTruthy();
  });

  it('should display lessons "Title"');
  it('should display first lessons "Language"');
  it('should display second lessons "Language"');
  it('should display lessons "#Vocabularies"');
  it('should display lessons "Due Vocabularies"');

  it('should have button "Create"');
  it('should have button "Edit"');
  it('should have button "Delete"');

  it('should navigate to add-lesson component when clicking "Create"');
  it('should navigate to edit-lesson component when clicking "Edit"');
  it('should stay on list-lessons component when clicking "Delete"');
});
