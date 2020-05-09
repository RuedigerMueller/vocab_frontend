import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListVocabularyComponent } from './list-vocabulary.component';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClient } from '@angular/common/http';

describe('ListVocabulariesComponent', () => {
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;

  let component: ListVocabularyComponent;
  let fixture: ComponentFixture<ListVocabularyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListVocabularyComponent ],
      imports: [
        HttpClientTestingModule,
        RouterTestingModule.withRoutes([]),
      ],
    })
    .compileComponents();

    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListVocabularyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
