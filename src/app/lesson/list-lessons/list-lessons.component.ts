import { Component, OnInit, NgZone } from '@angular/core';
import { Lesson } from '../../models/lesson.model.';
import { Router } from '@angular/router';
import { frontend } from 'src/app/resource.identifiers';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { getError, getLessons, State } from '../state/lesson.reducer';
import * as LessonActions from '../state/lesson.actions';

@Component({
  selector: 'app-list-lessons',
  templateUrl: './list-lessons.component.html',
  styleUrls: ['./list-lessons.component.scss']
})
export class ListLessonsComponent implements OnInit {
  lessons: ReadonlyArray<Lesson>;
  lessons$: Observable<ReadonlyArray<Lesson>>;
  errorMessage$: Observable<string>;

  constructor(private store: Store<State>, private ngZone: NgZone, private router: Router) { }

  ngOnInit(): void {
    this.lessons$ = this.store.select(getLessons);
    this.errorMessage$ = this.store.select(getError);

    this.store.dispatch(LessonActions.loadLessons());
  }

  createLesson() {
    this.ngZone.run(() => this.router.navigateByUrl(`/${frontend.lessons}/${frontend.createLesson}`));
  }

  updateLesson(id: string): void {
    this.ngZone.run(() => this.router.navigateByUrl(`/${frontend.lessons}/${id}/${frontend.editLesson}`));
  }

  deleteLesson(id: string): void {
    /* this.lessonService.deleteLesson(id).subscribe(() => {
      this.getLessons();
    }); */
  }

  lessonVocabulary(id: string): void {
    this.ngZone.run(() => this.router.navigateByUrl(`/${frontend.lessons}/${id}/${frontend.vocabulary}`));
  }

  lessonQuiz(id: string): void {
    this.ngZone.run(() => this.router.navigateByUrl(`/${frontend.lessons}/${id}/${frontend.quiz}`));
  }
}
