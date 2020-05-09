import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddVocabularyComponent } from './add-vocabulary.component';
import { HttpClient } from '@angular/common/http';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ReactiveFormsModule } from '@angular/forms';

describe('AddVocabularyComponent', () => {
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;

  let component: AddVocabularyComponent;
  let fixture: ComponentFixture<AddVocabularyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddVocabularyComponent ],
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
    fixture = TestBed.createComponent(AddVocabularyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
