import { Component, OnInit, NgZone } from '@angular/core';
import { Lesson } from '../../models/lesson.model.';
import { LessonService } from '../../services/lesson.service';
import { Router } from '@angular/router';
import { frontend } from 'src/app/resource.identifiers';

@Component({
  selector: 'app-list-lessons',
  templateUrl: './list-lessons.component.html',
  styleUrls: ['./list-lessons.component.scss']
})
export class ListLessonsComponent implements OnInit {
  lessons: ReadonlyArray<Lesson>;

  constructor(private lessonService: LessonService, private ngZone: NgZone, private router: Router) { }

  ngOnInit(): void {
    this.getLessons();
  }

  getLessons(): void {
    this.lessonService.getLessons().subscribe((lessons: Lesson[]) => {
      this.lessons = lessons;
    });
  }

  createLesson() {
    this.ngZone.run(() => this.router.navigateByUrl(`/${frontend.lessons}/${frontend.createLesson}`));
  }

  updateLesson(id: string): void {
    this.ngZone.run(() => this.router.navigateByUrl(`/${frontend.lessons}/${id}/${frontend.editLesson}`));
  }

  deleteLesson(id: string): void {
    this.lessonService.deleteLesson(id).subscribe(() => {
      this.getLessons();
    });
  }

  lessonVocabulary(id: string): void {
    this.ngZone.run(() => this.router.navigateByUrl(`/${frontend.lessons}/${id}/${frontend.vocabulary}`));
  }

  lessonQuiz(id: string): void {
    this.ngZone.run(() => this.router.navigateByUrl(`/${frontend.lessons}/${id}/${frontend.quiz}`));
  }
}
