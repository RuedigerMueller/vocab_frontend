import { ChangeDetectorRef, Component, ElementRef, NgZone, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonComponent, DialogService, FormControlComponent, InputGroupTextareaDirective } from '@fundamental-ngx/core';
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
export class QuizComponent implements OnInit {
  dueVocabulary: ReadonlyArray<Vocabulary>;
  vocabulary: Vocabulary;
  lessonID: string;
  lesson: Lesson;
  questionedVocabulary: number;
  numberDueVocabularies: number;
  numberKnownVocabularies: number;
  numberUnknownVocabularies: number;
  entryFieldState = '';
  displayCheckResponseButton = true;
  displayValidateResponseButton = false;
  displayInvalidateResponseButton = false;
  displayNextButton = false;
  nextButtonType = '';
  enteredResponse = '';
  correctResponse = '';

  constructor(
    private vocabularyService: VocabularyService,
    private lessonService: LessonService,
    private ngZone: NgZone,
    private router: Router,
    private route: ActivatedRoute,
    private dialogService: DialogService,
    private changeDetector: ChangeDetectorRef,
  ) { }


  @ViewChild('nextButton') nextButton: ButtonComponent;
  @ViewChild('quizLearnedLanguage') quizLearnedLanguageTextArea: FormControlComponent;

  ngOnInit(): void {
    this.lessonID = this.route.snapshot.paramMap.get(frontend.lessonID);
    this.getLesson(this.lessonID);
    this.getDueVocabulary(this.lessonID);
    this.numberKnownVocabularies = 0;
    this.numberUnknownVocabularies = 0;
  }

  /* ngAfterViewChecked(): void {
   // this.setKeyboardFocus();
   // this.changeDetector.detectChanges();
  } */

  getLesson(lessonID: string): void {
    this.lessonService.getLesson(lessonID).subscribe((lesson: Lesson) => {
      this.lesson = lesson;
    });
  }

  getDueVocabulary(lessonID: string): void {
    this.vocabularyService.getDueLessonVocabulary(lessonID).subscribe((vocabulary: Vocabulary[]) => {
      this.dueVocabulary = this.shuffle(vocabulary);
      this.numberDueVocabularies = this.dueVocabulary.length;
      this.questionedVocabulary = (this.numberDueVocabularies > 0) ? 1 : 0;
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

  setKeyboardFocus() {
    if (this.displayNextButton) {
      if (this.nextButton.elementRef) { this.nextButton.elementRef().nativeElement.focus(); }
    }
    if (this.displayCheckResponseButton) {
      if (this.quizLearnedLanguageTextArea) { this.quizLearnedLanguageTextArea.elementRef().nativeElement.focus(); }
    }
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
    this.changeDetector.detectChanges();
    this.setKeyboardFocus();
  }

  validResponse(): void {
    this.entryFieldState = 'success';
    this.displayCheckResponseButton = false;
    this.displayValidateResponseButton = false;
    this.displayInvalidateResponseButton = true;
    this.displayNextButton = true;
    this.nextButtonType = '';

    this.changeDetector.detectChanges();
    this.setKeyboardFocus();
  }

  invalidResponse(): void {
    this.entryFieldState = 'error';
    this.displayCheckResponseButton = false;
    this.displayValidateResponseButton = true;
    this.displayInvalidateResponseButton = false;
    this.displayNextButton = true;
    this.nextButtonType = '';

    this.changeDetector.detectChanges();
    this.setKeyboardFocus();
  }

  next(): void {
    // Update backend
    if (this.entryFieldState === 'success') {
      this.numberKnownVocabularies++;
      this.vocabularyService.vocabularyKnown(this.vocabulary.id.toString()).subscribe(() => { });
    } else {
      this.numberUnknownVocabularies++;
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

    this.changeDetector.detectChanges();
    this.setKeyboardFocus();

    // In case we are not yet at the end of th quiz: move to next vocabulary; otherwise return to lesson list
    if (this.questionedVocabulary < this.numberDueVocabularies) {
      this.enteredResponse = '';
      this.vocabulary = this.dueVocabulary[this.questionedVocabulary];
      this.questionedVocabulary += 1;
    } else {
      // ToDo: Add quiz summary: known/unknown/total/percentage
      this.ngZone.run(() => this.router.navigateByUrl(`/${frontend.lessons}`));
    }
  }

  cancel(dialog: TemplateRef<any>): void {
    const dialogRef = this.dialogService.open(dialog, { responsivePadding: true });

    dialogRef.afterClosed.subscribe(
      (result) => {
        if (result === 'Yes') {
          this.ngZone.run(() => this.router.navigateByUrl(`/${frontend.lessons}`));
        }
      },
      (error) => {
        console.log(error);
      }
    );
  }
}
