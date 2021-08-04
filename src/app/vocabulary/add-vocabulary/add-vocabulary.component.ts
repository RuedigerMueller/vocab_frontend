import { Component, OnInit, NgZone, ViewChild, Input, ElementRef } from '@angular/core';
import { VocabularyService } from '../../services/vocabulary.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Vocabulary } from '../../models/vocabulary.model';
import { Lesson } from 'src/app/models/lesson.model.';
import { LessonService } from 'src/app/services/lesson.service';
import { frontend } from 'src/app/resource.identifiers';
import { FormControlComponent } from '@fundamental-ngx/core';
import { Store } from '@ngrx/store';
import { State } from '../state/vocabulary.reducer';
import { Observable } from 'rxjs';
import { selectLessonByID } from 'src/app/lesson/state/lesson.reducer';
import { createVocabulary } from '../state/vocabulary.actions';

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
    private store: Store<State>,
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
    this.store.dispatch(createVocabulary({vocabulary}));
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
