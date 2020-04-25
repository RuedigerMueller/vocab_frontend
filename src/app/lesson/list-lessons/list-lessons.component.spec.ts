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

  it('should have the required column heading', () => {
    let success = true;

    const expectedColumns = ['Title', 'Language', '#Vocabularies', '#Due Vocabularies', 'Actions'];

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
  });

  it('should have required buttons', () => {
    let success = true;

    //const expectedButtons = ['Create', 'Edit', 'Delete'];
    const expectedButtons = ['Create'];

    const appElement: HTMLElement = fixture.nativeElement;
    const buttons = appElement.querySelectorAll('button');

    for (const expectedButton of expectedButtons) {
      let found = false;
      buttons.forEach((button) => {
        if (button.textContent === expectedButton) {
          found = true;
        }
      });

      if (found === false) {
        success = false;
        expect(found).toBeTruthy(`Button ${expectedButton} not found`);
      }
    }
    expect(success).toBeTruthy('All expected buttons rendered');
  });

  it('should display lessons "Title"');
  it('should display first lessons "Language"');
  it('should display second lessons "Language"');
  it('should display lessons "#Vocabularies"');
  it('should display lessons "#Due Vocabularies"');

  it('should navigate to add-lesson component when clicking "Create"');
  it('should navigate to edit-lesson component when clicking "Edit"');
  it('should stay on list-lessons component when clicking "Delete"');
});
