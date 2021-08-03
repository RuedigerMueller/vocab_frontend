import { Component, OnInit, NgZone } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Lesson } from '../../models/lesson.model.';
import { frontend } from 'src/app/resource.identifiers';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { selectLessonByID, State } from '../state/lesson.reducer';
import { tap } from 'rxjs/operators';
import * as LessonActions from '../state/lesson.actions';

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
    private store: Store<State>,
    public fb: FormBuilder,
    private ngZone: NgZone,
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    const id: number = parseInt(this.route.snapshot.paramMap.get(`${frontend.lessonID}`), 10);

    this.lesson$ = this.store.select(selectLessonByID(id))
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
        this.store.dispatch(LessonActions.updateLesson( { lessonID: lesson.id, lesson: this.editLessonForm.value }));
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
