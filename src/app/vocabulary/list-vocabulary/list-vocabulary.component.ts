import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Vocabulary } from '../vocabulary.service.interface';
import { VocabularyService } from '../vocabulary.service';
import { Lesson } from 'src/app/lesson/lesson.service.interface';
import { LessonService } from 'src/app/lesson/lesson.service';


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
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.lessonID = this.route.snapshot.paramMap.get('id');
    this.getLesson(this.lessonID);
    this.getVocabulary(this.lessonID);
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

  createVocabulary(): void {
    this.router.navigateByUrl(`/addVocabulary/${this.lessonID}`);
  }

  updateVocabulary(id: string): void {
    this.router.navigateByUrl(`/editVocabulary/${id}`);
  }

  deleteVocabulary(id: string): void {
    this.vocabularyService.deleteVocabulary(id).subscribe(() => {
      this.getVocabulary(this.lessonID);
    });
  }
}


