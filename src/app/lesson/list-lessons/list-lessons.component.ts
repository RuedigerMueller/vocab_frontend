import { Component, OnInit } from '@angular/core';
import { Lesson } from '../lesson.service.interface';
import { LessonService } from '../lesson.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list-lessons',
  templateUrl: './list-lessons.component.html',
  styleUrls: ['./list-lessons.component.scss']
})
export class ListLessonsComponent implements OnInit {
  lessons: ReadonlyArray<Lesson>;

  constructor(private lessonService: LessonService, private router: Router) { }

  ngOnInit(): void {
    this.getLessons();
  }

  getLessons(): void {
    this.lessonService.getLessons().subscribe((lessons: Lesson[]) => {
      this.lessons = lessons;
    });
  }

  createLesson() {
    this.router.navigateByUrl('/createLesson');
  }

  updateLesson(id: string): void {
    this.router.navigateByUrl(`/editLesson/${id}`);
  }

  deleteLesson(id: string): void {
    this.lessonService.deleteLesson(id).subscribe(() => {
      this.getLessons();
    });
  }

  lessonVocabulary(id: string): void {
    this.router.navigateByUrl(`/lesson/${id}/vocabulary`);
  }

  lessonQuiz(id: string): void {
    alert('Stay tuned - will come soon');
  }
}
