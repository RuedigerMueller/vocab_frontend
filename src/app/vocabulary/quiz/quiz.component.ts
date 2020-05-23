import { Component, NgZone, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { frontend } from 'src/app/resource.identifiers';
import { VocabularyService } from '../vocabulary.service';
import { Vocabulary } from '../vocabulary.service.interface';

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.scss']
})
export class QuizComponent implements OnInit {
  dueVocabulary: ReadonlyArray<Vocabulary>;
  lessonID: string;
  // lesson: Lesson;

  constructor(
    private vocabularyService: VocabularyService,
    // private lessonService: LessonService,
    private ngZone: NgZone,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.lessonID = this.route.snapshot.paramMap.get(frontend.lessonID);
    // this.getLesson(this.lessonID);
    this.getDueVocabulary(this.lessonID);
  }

  /* getLesson(lessonID: string): void {
    this.lessonService.getLesson(lessonID).subscribe((lesson: Lesson) => {
      this.lesson = lesson;
    });
  } */

  getDueVocabulary(lessonID: string): void {
    this.vocabularyService.getDueLessonVocabulary(lessonID).subscribe((vocabulary: Vocabulary[]) => {
      this.dueVocabulary = this.shuffle(vocabulary);
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
}
