import { AfterViewChecked, Component, ElementRef, NgZone, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonComponent } from '@fundamental-ngx/core';
import { Lesson } from 'src/app/models/lesson.model.';
import { frontend } from 'src/app/resource.identifiers';
import { LessonService } from 'src/app/services/lesson.service';
import { Vocabulary } from '../../models/vocabulary.model';
import { VocabularyService } from '../../services/vocabulary.service';

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.scss']
})
export class QuizComponent implements OnInit, AfterViewChecked {

  constructor(
    private vocabularyService: VocabularyService,
    private lessonService: LessonService,
    private ngZone: NgZone,
    private router: Router,
    private route: ActivatedRoute
  ) { }
  dueVocabulary: ReadonlyArray<Vocabulary>;
  vocabulary: Vocabulary;
  lessonID: string;
  lesson: Lesson;
  questionedVocabulary: number;
  numberDueVocabularies: number;
  entryFieldState = '';
  displayCheckResponseButton = true;
  displayValidateResponseButton = false;
  displayInvalidateResponseButton = false;
  displayNextButton = false;
  nextButtonType = '';
  enteredResponse = '';
  correctResponse = '';

  @ViewChild('nextButton') nextButton: ButtonComponent;
  @ViewChild('quizLearnedLanguage') quizLearnedLanguageTextArea: ElementRef;

  ngOnInit(): void {
    this.lessonID = this.route.snapshot.paramMap.get(frontend.lessonID);
    this.getLesson(this.lessonID);
    this.getDueVocabulary(this.lessonID);
    this.questionedVocabulary = 1;
  }

  ngAfterViewChecked(): void {
    if (this.displayNextButton) {
      if (this.nextButton.elementRef) { this.nextButton.elementRef().nativeElement.focus(); }
    }
    if (this.displayCheckResponseButton) {
      if (this.quizLearnedLanguageTextArea) { this.quizLearnedLanguageTextArea.nativeElement.focus(); }
    }
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
      }
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
    this.correctResponse = this.vocabulary.language_b;

    if (this.enteredResponse.trim() === this.vocabulary.language_b) {
      this.entryFieldState = 'success';
      this.displayCheckResponseButton = false;
      this.displayValidateResponseButton = false;
      this.displayInvalidateResponseButton = false;
      this.displayNextButton = true;
      this.nextButtonType = 'positive';
    } else {
      this.entryFieldState = 'error';
      this.displayCheckResponseButton = false;
      this.displayValidateResponseButton = true;
      this.displayInvalidateResponseButton = false;
      this.displayNextButton = true;
      this.nextButtonType = '';
    }
  }

  validResponse(): void {
    this.entryFieldState = 'success';
    this.displayCheckResponseButton = false;
    this.displayValidateResponseButton = false;
    this.displayInvalidateResponseButton = true;
    this.displayNextButton = true;
    this.nextButtonType = '';
  }

  invalidResponse(): void {
    this.entryFieldState = 'error';
    this.displayCheckResponseButton = false;
    this.displayValidateResponseButton = true;
    this.displayInvalidateResponseButton = false;
    this.displayNextButton = true;
    this.nextButtonType = '';
  }

  next(): void {
    // Update backend
    if (this.entryFieldState === 'success') {
      this.vocabularyService.vocabularyKnown(this.vocabulary.id.toString()).subscribe(() => { });
    } else {
      this.vocabularyService.vocabularyUnknown(this.vocabulary.id.toString()).subscribe(() => { });
    }

    // Reset states and buttons for next vocabulary
    this.correctResponse = '';
    this.entryFieldState = '';
    this.displayCheckResponseButton = true;
    this.displayValidateResponseButton = false;
    this.displayInvalidateResponseButton = false;
    this.displayNextButton = false;
    this.nextButtonType = '';

    // In case we are not yet at the end of th quiz: move to next vocabulary; otherwise return to lesson list
    if (this.questionedVocabulary < this.numberDueVocabularies) {
      this.enteredResponse = '';
      this.vocabulary = this.dueVocabulary[this.questionedVocabulary];
      this.questionedVocabulary += 1;
    } else {
      this.ngZone.run(() => this.router.navigateByUrl(`/${frontend.lessons}`));
    }
  }

  cancel(): void {
    this.ngZone.run(() => this.router.navigateByUrl(`/${frontend.lessons}`));
  }
}
