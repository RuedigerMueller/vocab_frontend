import { Component, NgZone, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { frontend } from 'src/app/resource.identifiers';
import { VocabularyService } from '../vocabulary.service';
import { Vocabulary } from '../vocabulary.service.interface';
import { Lesson } from 'src/app/lesson/lesson.service.interface';
import { LessonService } from 'src/app/lesson/lesson.service';

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.scss']
})
export class QuizComponent implements OnInit {
  dueVocabulary: ReadonlyArray<Vocabulary>;
  vocabulary: Vocabulary;
  lessonID: string;
  lesson: Lesson;
  questionedVocabulary: number;
  numberDueVocabularies: number;

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
    this.getDueVocabulary(this.lessonID);
    this.questionedVocabulary = 1;
  }

  getLesson(lessonID: string): void {
    this.lessonService.getLesson(lessonID).subscribe((lesson: Lesson) => {
      this.lesson = lesson;
    });
  }

  getDueVocabulary(lessonID: string): void {
    this.vocabularyService.getDueLessonVocabulary(lessonID).subscribe((vocabulary: Vocabulary[]) => {
      this.dueVocabulary = this.shuffle(vocabulary);
      this.numberDueVocabularies = this.dueVocabulary.length;
      if (this.dueVocabulary[0]) {
        this.vocabulary = this.dueVocabulary[0];
      };
    });
  }

  shuffle(vocabulary: Vocabulary[]): Vocabulary[] {
    let currentIndex: number = vocabulary.length;
    let temporaryValue: Vocabulary;
    let randomIndex: number;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      // And swap it with the current element.
      temporaryValue = vocabulary[currentIndex];
      vocabulary[currentIndex] = vocabulary[randomIndex];
      vocabulary[randomIndex] = temporaryValue;
    }

    return vocabulary;
  }

  checkResponse(): void {
    
  }

  validResponse(): void {

  }

  invalidResponse(): void {

  }

  next(): void {

  }

  cancel(): void {
    this.ngZone.run(() => this.router.navigateByUrl(`/${frontend.lessons}`));
  }
}
