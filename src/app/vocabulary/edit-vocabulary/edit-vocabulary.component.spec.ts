import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditVocabularyComponent } from './edit-vocabulary.component';
import { HttpClient } from '@angular/common/http';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ReactiveFormsModule } from '@angular/forms';

describe('EditVocabularyComponent', () => {
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;

  let component: EditVocabularyComponent;
  let fixture: ComponentFixture<EditVocabularyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditVocabularyComponent ],
      imports: [
        ReactiveFormsModule,
        HttpClientTestingModule,
        RouterTestingModule.withRoutes([]),
      ],
    })
    .compileComponents();

    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditVocabularyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
