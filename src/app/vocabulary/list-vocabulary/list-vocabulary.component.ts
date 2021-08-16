import { Component, NgZone, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Lesson } from 'src/app/models/lesson.model.';
import { frontend } from 'src/app/resource.identifiers';
import { Vocabulary } from '../../models/vocabulary.model';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { getError, getVocabulary, State } from '../state/vocabulary.reducer';
import * as VocabularyActions from '../state/vocabulary.actions';
import { selectLessonByID } from 'src/app/lesson/state/lesson.reducer';

@Component({
  selector: 'app-list-vocabulary',
  templateUrl: './list-vocabulary.component.html',
  styleUrls: ['./list-vocabulary.component.scss']
})
export class ListVocabularyComponent implements OnInit {

  vocabulary$: Observable<ReadonlyArray<Vocabulary>>;
  errorMessage$: Observable<string>;

  lessonID: number;
  lesson: Lesson;
  lesson$: Observable<Lesson>;
  lessons$: Observable<ReadonlyArray<Lesson>>;

  constructor(
    private store: Store<State>,
    private ngZone: NgZone,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.lessonID = parseInt(this.route.snapshot.paramMap.get('lessonID'), 10);
    this.lesson$ = this.store.select(selectLessonByID(this.lessonID));

    this.vocabulary$ = this.store.select(getVocabulary);
    this.errorMessage$ = this.store.select(getError);

    this.store.dispatch(VocabularyActions.loadVocabulary( { lessonID: this.lessonID }));
  }

  createVocabulary(): void {
    this.ngZone.run(() => this.router.navigateByUrl(`/${frontend.lessons}/${this.lessonID}/${frontend.addVocabulary}`));
  }

  updateVocabulary(id: number): void {
    this.ngZone.run(() => this.router.navigateByUrl(`/${frontend.lessons}/${this.lessonID}/${frontend.editVocabulary}/${id}`));
  }

  deleteVocabulary(id: number): void {
     this.store.dispatch(VocabularyActions.deleteVocabulary({vocabularyID: id }));
  }

  closeLesson(): void {
    this.ngZone.run(() => this.router.navigateByUrl(`/${frontend.lessons}`));
  }
}
