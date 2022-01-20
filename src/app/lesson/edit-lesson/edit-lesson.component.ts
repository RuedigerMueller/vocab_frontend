import { Component, NgZone, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, tap } from 'rxjs';
import { frontend } from 'src/app/resource.identifiers';
import { Lesson } from '../../models/lesson.model';
import * as fromActions from '../state/lesson.actions';
import * as fromReducer from '../state/lesson.reducer';

@Component({
  selector: 'app-edit-lesson',
  templateUrl: './edit-lesson.component.html',
  styleUrls: ['./edit-lesson.component.scss']
})
export class EditLessonComponent implements OnInit {
  editLessonForm: FormGroup;
  lesson: Lesson;
  lesson$: Observable<Lesson | null>;

  constructor(
    private store: Store<fromReducer.State>,
    public fb: FormBuilder,
    private ngZone: NgZone,
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    const lessonID: number  = parseInt(this.route.snapshot.paramMap.get('lessonID'), 10);

    this.lesson$ = this.store.select(fromReducer.selectLessonByID(lessonID))
      .pipe(
        tap(currentLesson => this.displayLesson(currentLesson))
      );

    this.editLessonForm = this.fb.group({
      title: [''],
      language_a: [''],
      language_b: ['']
    });

  }

  submitForm(originalLesson: Lesson): void {
    if (this.editLessonForm.valid) {
      if (this.editLessonForm.dirty) {
        const lesson = { ...originalLesson, ...this.editLessonForm.value };
        this.store.dispatch(fromActions.updateLesson( { lessonID: lesson.id, lesson: this.editLessonForm.value }));
        this.ngZone.run(() => this.router.navigateByUrl(`/${frontend.lessons}`));
      }
    }
  }

  cancel(): void {
    this.ngZone.run(() => this.router.navigateByUrl(`/${frontend.lessons}`));
  }

  displayLesson(lesson: Lesson | null): void {
    if (lesson) {
      // Reset the form back to pristine
      this.editLessonForm.reset();

      /* // Display the appropriate page title
      if (lesson.id === -1) {
        this.pageTitle = 'Add Product';
      } else {
        this.pageTitle = `Edit Product: ${product.productName}`;
      } */

      // Update the data on the form
      this.editLessonForm.patchValue({
        title: lesson.title,
        language_a: lesson.language_a,
        language_b: lesson.language_b
      });
    }
  }
}
