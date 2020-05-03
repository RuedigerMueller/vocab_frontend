import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListVocabulariesComponent } from './list-vocabularies.component';

describe('ListVocabulariesComponent', () => {
  let component: ListVocabulariesComponent;
  let fixture: ComponentFixture<ListVocabulariesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListVocabulariesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListVocabulariesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
