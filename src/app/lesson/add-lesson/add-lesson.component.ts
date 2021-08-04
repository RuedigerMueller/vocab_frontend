import { Component, OnInit, NgZone } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
// import { LessonService } from '../../services/lesson.service';
import { frontend } from 'src/app/resource.identifiers';
import { Store } from '@ngrx/store';
import { State } from '../state/lesson.reducer';
import { createLesson } from '../state/lesson.actions';

@Component({
  selector: 'app-add-lesson',
  templateUrl: './add-lesson.component.html',
  styleUrls: ['./add-lesson.component.scss']
})
export class AddLessonComponent implements OnInit {
  lessonForm: FormGroup;

  constructor(
    private store: Store<State>,
    public fb: FormBuilder,
    private ngZone: NgZone,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.lessonForm = this.fb.group({
      title: [''],
      language_a: [''],
      language_b: ['']
    });
  }

  submitForm() {
    this.store.dispatch(createLesson({lesson: this.lessonForm.value}))
    this.ngZone.run(() => this.router.navigateByUrl(`/${frontend.lessons}`));
  }

  cancel(): void {
    this.ngZone.run(() => this.router.navigateByUrl(`/${frontend.lessons}`));
  }
}
