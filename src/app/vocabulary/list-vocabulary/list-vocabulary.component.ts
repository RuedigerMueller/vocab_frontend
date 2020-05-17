import { Component, OnInit, NgZone } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Vocabulary } from '../vocabulary.service.interface';
import { VocabularyService } from '../vocabulary.service';
import { Lesson } from 'src/app/lesson/lesson.service.interface';
import { LessonService } from 'src/app/lesson/lesson.service';
import { frontend } from 'src/app/resource.identifiers';


@Component({
  selector: 'app-list-vocabulary',
  templateUrl: './list-vocabulary.component.html',
  styleUrls: ['./list-vocabulary.component.scss']
})
export class ListVocabularyComponent implements OnInit {
  vocabulary: ReadonlyArray<Vocabulary>;
  lessonID: string;
  lesson: Lesson;

  constructor(
    private vocabularyService: VocabularyService,
    private lessonService: LessonService,
    private ngZone: NgZone,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.lessonID = this.route.snapshot.paramMap.get(frontend.lessonID);
    this.getLesson(this.lessonID);
    this.getVocabulary(this.lessonID);
  }

  createVocabulary(): void {
    this.ngZone.run(() => this.router.navigateByUrl(`/${frontend.lessons}/${this.lessonID}/${frontend.addVocabulary}`));
  }

  getLesson(id: string): void  {
    this.lessonService.getLesson(id).subscribe((lesson: Lesson) => {
      this.lesson = lesson;
    });
  }

  getVocabulary(id: string): void {
    this.vocabularyService.getLessonVocabulary(id).subscribe((vocabulary: Vocabulary[]) => {
      this.vocabulary = vocabulary;
    });
  }

  updateVocabulary(id: string): void {
    this.ngZone.run(() => this.router.navigateByUrl(`/${frontend.lessons}/${this.lessonID}/${frontend.editVocabulary}/${id}`));
  }

  deleteVocabulary(id: string): void {
    this.vocabularyService.deleteVocabulary(id).subscribe(() => {
      this.getVocabulary(this.lessonID);
    });
  }
}


