import { Component, OnInit, NgZone } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { LessonService } from '../../services/lesson.service';
import { frontend } from 'src/app/resource.identifiers';

@Component({
  selector: 'app-add-lesson',
  templateUrl: './add-lesson.component.html',
  styleUrls: ['./add-lesson.component.scss']
})
export class AddLessonComponent implements OnInit {
  lessonForm: FormGroup;

  constructor(
    public fb: FormBuilder,
    private ngZone: NgZone,
    private router: Router,
    private lessonService: LessonService
  ) { }

  ngOnInit(): void {
    this.lessonForm = this.fb.group({
      title: [''],
      language_a: [''],
      language_b: ['']
    });
  }

  submitForm() {
    this.lessonService.createLesson(this.lessonForm.value).subscribe(res => {
      this.ngZone.run(() => this.router.navigateByUrl(`/${frontend.lessons}`));
    });
  }

  cancel(): void {
    this.ngZone.run(() => this.router.navigateByUrl(`/${frontend.lessons}`));
  }
}
