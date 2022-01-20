import { Component, OnInit, NgZone } from '@angular/core';
import { Lesson } from '../../models/lesson.model';
import { Router } from '@angular/router';
import { frontend } from 'src/app/resource.identifiers';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import * as fromReducer from '../state/lesson.reducer';
import * as fromActions from '../state/lesson.actions';

@Component({
  selector: 'app-list-lessons',
  templateUrl: './list-lessons.component.html',
  styleUrls: ['./list-lessons.component.scss']
})
export class ListLessonsComponent implements OnInit {
  lessons$: Observable<ReadonlyArray<Lesson>>;
  errorMessage$: Observable<string>;

  constructor(private store: Store<fromReducer.State>, private ngZone: NgZone, private router: Router) { }

  ngOnInit(): void {
    this.lessons$ = this.store.select(fromReducer.getLessons);
    this.errorMessage$ = this.store.select(fromReducer.getError);

    this.store.dispatch(fromActions.loadLessons());
  }

  createLesson() {
    this.ngZone.run(() => this.router.navigateByUrl(`/${frontend.lessons}/${frontend.createLesson}`));
  }

  updateLesson(id: number): void {
    this.ngZone.run(() => this.router.navigateByUrl(`/${frontend.lessons}/${id}/${frontend.editLesson}`));
  }

  deleteLesson(id: number): void {
    this.store.dispatch(fromActions.deleteLesson({ lessonID : id }));
  }

  lessonVocabulary(id: number): void {
    this.ngZone.run(() => this.router.navigateByUrl(`/${frontend.lessons}/${id}/${frontend.vocabulary}`));
  }

  lessonQuiz(id: number): void {
    this.ngZone.run(() => this.router.navigateByUrl(`/${frontend.lessons}/${id}/${frontend.quiz}`));
  }
}
