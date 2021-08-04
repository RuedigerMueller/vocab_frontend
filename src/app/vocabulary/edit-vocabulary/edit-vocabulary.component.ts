import { Component, NgZone, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { frontend } from 'src/app/resource.identifiers';
import { Vocabulary } from '../../models/vocabulary.model';
import { selectVocabularyByID, State } from '../state/vocabulary.reducer';
import * as VocabularyActions from '../state/vocabulary.actions';
import { Lesson } from 'src/app/models/lesson.model.';
import { selectLessonByID } from 'src/app/lesson/state/lesson.reducer';

@Component({
  selector: 'app-edit-vocabulary',
  templateUrl: './edit-vocabulary.component.html',
  styleUrls: ['./edit-vocabulary.component.scss']
})
export class EditVocabularyComponent implements OnInit {
  vocabulary$: Observable<Vocabulary>;
  lesson$: Observable<Lesson>;
  lessonID: number;
  editVocabularyForm: FormGroup;

  constructor(
    private store: Store<State>,
    public fb: FormBuilder,
    private ngZone: NgZone,
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    const vocabularyID: number = parseInt(this.route.snapshot.paramMap.get('vocabularyID'), 10);
    this.lessonID = parseInt(this.route.snapshot.paramMap.get('lessonID'), 10);

    this.vocabulary$ = this.store.select(selectVocabularyByID(vocabularyID))
      .pipe(
        tap(currentVocabulary => this.displayVocabulary(currentVocabulary))
      );

    this.lesson$ = this.store.select(selectLessonByID(this.lessonID));

    this.editVocabularyForm = this.fb.group({
      language_a: [''],
      language_b: [''],
    });
  }

  submitForm(originalVocabulary: Vocabulary): void {
    if (this.editVocabularyForm.valid) {
      if (this.editVocabularyForm.dirty) {
        const vocabulary = { ...originalVocabulary, ...this.editVocabularyForm.value };
        this.store.dispatch(VocabularyActions.updateVocabulary({
          vocabularyID: vocabulary.id,
          vocabulary
        }));
        this.ngZone.run(() => this.router.navigateByUrl(`/${frontend.lessons}`));
      }
    }
    this.ngZone.run(() => this.router.navigateByUrl(`/${frontend.lessons}/${this.lessonID}/${frontend.vocabulary}`));
  }

  cancel(): void {
    this.ngZone.run(() => this.router.navigateByUrl(`/${frontend.lessons}/${this.lessonID}/${frontend.vocabulary}`));
  }

  displayVocabulary(vocabulary: Vocabulary | null): void {
    if (vocabulary) {
      // Reset the form back to pristine
      this.editVocabularyForm.reset();

      /* // Display the appropriate page title
      if (lesson.id === -1) {
        this.pageTitle = 'Add Product';
      } else {
        this.pageTitle = `Edit Product: ${product.productName}`;
      } */

      // Update the data on the form
      this.editVocabularyForm.patchValue({
        language_a: vocabulary.language_a,
        language_b: vocabulary.language_b
      });
    }
  }
}
