import { ChangeDetectorRef, Component, NgZone, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonComponent, DialogService, FormControlComponent } from '@fundamental-ngx/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { selectLessonByID } from 'src/app/lesson/state/lesson.reducer';
import { Lesson } from 'src/app/models/lesson.model.';
import { frontend } from 'src/app/resource.identifiers';
import { Vocabulary } from '../../models/vocabulary.model';
import * as QuizActions from './state/quiz.actions';
import {
  getCurrentVocabulary,
  getError, getNumberDueVocabularies, getNumberKnownVocabularies,
  getNumberQuestionedVocabularies, getNumberUnknownVocabularies,
  getUIElementState,
  getVocabulary,
  quizComplete, QuizUIElementState, State
} from './state/quiz.reducer';

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.scss']
})
export class QuizComponent implements OnInit {
  lessonID: number;
  lesson$: Observable<Lesson>;
  numberDueVocabularies$: Observable<number>;
  questionedVocabulary$: Observable<number>;
  numberKnownVocabularies$: Observable<number>;
  numberUnknownVocabularies$: Observable<number>;
  currentVocabulary$: Observable<Vocabulary>;
  UIElementState$: Observable<QuizUIElementState>;
  errorMessage$: Observable<string>;
  quizComplete$: Observable<boolean>;
  enteredResponse: string;
  currentVocabulary: Vocabulary;
  responseSate: string;

  constructor(
    private store: Store<State>,
    private ngZone: NgZone,
    private router: Router,
    private route: ActivatedRoute,
    private dialogService: DialogService,
    // private changeDetector: ChangeDetectorRef,
  ) { }


  @ViewChild('nextButton') nextButton: ButtonComponent;
  @ViewChild('quizLearnedLanguage') quizLearnedLanguageTextArea: FormControlComponent;

  ngOnInit(): void {
    this.lessonID = parseInt(this.route.snapshot.paramMap.get(frontend.lessonID), 10);

    this.lesson$ = this.store.select(selectLessonByID(this.lessonID));
    this.numberDueVocabularies$ = this.store.select(getNumberDueVocabularies);
    this.questionedVocabulary$ = this.store.select(getNumberQuestionedVocabularies);
    this.numberKnownVocabularies$ = this.store.select(getNumberKnownVocabularies);
    this.numberUnknownVocabularies$ = this.store.select(getNumberUnknownVocabularies);
    this.currentVocabulary$ = this.store.select(getCurrentVocabulary)
      .pipe(
        tap(currentVocabulary => this.currentVocabulary = currentVocabulary)
     );
    this.UIElementState$ = this.store.select(getUIElementState)
      .pipe(
        tap(UiElementState => this.responseSate = UiElementState.entryFieldState)
      );

    this.quizComplete$ = this.store.select(quizComplete);

    this.errorMessage$ = this.store.select(getError);

    this.store.dispatch(QuizActions.loadQuiz({ lessonID: this.lessonID }));
  }

  /* ngAfterViewChecked(): void {
   // this.setKeyboardFocus();
   // this.changeDetector.detectChanges();
  } */

  setKeyboardFocus() {
    /* if (this.displayNextButton) {
      if (this.nextButton.elementRef) { this.nextButton.elementRef().nativeElement.focus(); }
    }
    if (this.displayCheckResponseButton) {
      if (this.quizLearnedLanguageTextArea) { this.quizLearnedLanguageTextArea.elementRef().nativeElement.focus(); }
    } */
  }

  checkResponse(): void {
    this.store.dispatch(QuizActions.checkResponse({ response: this.enteredResponse }));

    // this.changeDetector.detectChanges();
    // this.setKeyboardFocus();
  }

  validResponse(): void {
    this.store.dispatch(QuizActions.validResponse());

    // this.changeDetector.detectChanges();
    // this.setKeyboardFocus();
  }

  invalidResponse(): void {
    this.store.dispatch(QuizActions.invalidResponse());

    // this.changeDetector.detectChanges();
    // this.setKeyboardFocus();
  }

  next(): void {
    this.store.dispatch(QuizActions.next({vocabularyID: this.currentVocabulary.id, responseState: this.responseSate }));
    this.enteredResponse = '';

    // this.changeDetector.detectChanges();
    // this.setKeyboardFocus();

    /* // In case we are not yet at the end of th quiz: move to next vocabulary; otherwise return to lesson list
    if (this.questionedVocabulary >= this.numberDueVocabularies) {
      // ToDo: Add quiz summary: known/unknown/total/percentage
      this.ngZone.run(() => this.router.navigateByUrl(`/${frontend.lessons}`));
    } */
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
