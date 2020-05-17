import { Component, OnInit, NgZone } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { LessonService } from '../lesson.service';
import { Lesson } from '../lesson.service.interface';
import { frontend } from 'src/app/resource.identifiers';

@Component({
  selector: 'app-edit-lesson',
  templateUrl: './edit-lesson.component.html',
  styleUrls: ['./edit-lesson.component.scss']
})
export class EditLessonComponent implements OnInit {
  editLessonForm: FormGroup;
  lesson: Lesson;

  constructor(
    public fb: FormBuilder,
    private ngZone: NgZone,
    private router: Router,
    private route: ActivatedRoute,
    private lessonService: LessonService
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get(`${frontend.lessonID}`);

    this.lessonService.getLesson(id).subscribe((lesson: Lesson) => {
      this.lesson = lesson;

      this.editLessonForm = this.fb.group({
        title: this.lesson.title,
        language_a: this.lesson.language_a,
        language_b: this.lesson.language_b,
      });
    });
  }

  submitForm(): void {
    this.lessonService.updateLesson(this.lesson.id.toString(), this.editLessonForm.value).subscribe(res => {
      this.ngZone.run(() => this.router.navigateByUrl(`/${frontend.lessons}`));
    });
  }

  cancel(): void {
    this.ngZone.run(() => this.router.navigateByUrl(`/${frontend.lessons}`));
  }
}
