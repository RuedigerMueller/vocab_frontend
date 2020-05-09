import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditVocabularyComponent } from './edit-vocabulary.component';

describe('EditVocabularyComponent', () => {
  let component: EditVocabularyComponent;
  let fixture: ComponentFixture<EditVocabularyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditVocabularyComponent ]
    })
    .compileComponents();
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
