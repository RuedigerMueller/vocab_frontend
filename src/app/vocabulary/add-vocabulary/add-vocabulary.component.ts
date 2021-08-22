import { Component, NgZone, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControlComponent } from '@fundamental-ngx/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { selectLessonByID } from 'src/app/lesson/state/lesson.reducer';
import { Lesson } from 'src/app/models/lesson.model.';
import { frontend } from 'src/app/resource.identifiers';
import { Vocabulary } from '../../models/vocabulary.model';
import * as fromVocabularyActions from '../state/vocabulary.actions';
import * as fromVocabularyReducer from '../state/vocabulary.reducer';

@Component({
  selector: 'app-add-vocabulary',
  templateUrl: './add-vocabulary.component.html',
  styleUrls: ['./add-vocabulary.component.scss']
})
export class AddVocabularyComponent implements OnInit {
  lesson$: Observable<Lesson>;
  lessonID: number;
  addVocabularyForm: FormGroup;

  @ViewChild('addVocabularyLanguageA') addVocabularyLanguageAInput: FormControlComponent;

  constructor(
    private store: Store<fromVocabularyReducer.State>,
    public fb: FormBuilder,
    private ngZone: NgZone,
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.lessonID = parseInt(this.route.snapshot.paramMap.get(`${frontend.lessonID}`), 10);
    this.lesson$ = this.store.select(selectLessonByID(this.lessonID));

    this.addVocabularyForm = this.fb.group({
      language_a: [''],
      language_b: ['']
    });
  }

  submitForm(): void {
    const vocabulary: Vocabulary = this.addVocabularyForm.value;
    vocabulary.lesson = this.lessonID;
    this.store.dispatch(fromVocabularyActions.createVocabulary({vocabulary}));
    this.addVocabularyForm = this.fb.group({
      language_a: [''],
      language_b: ['']
    });
    this.addVocabularyLanguageAInput.elementRef().nativeElement.focus();
  }

  cancel(): void {
    this.ngZone.run(() => this.router.navigateByUrl(`/${frontend.lessons}/${this.lessonID}/${frontend.vocabulary}`));
  }
}
