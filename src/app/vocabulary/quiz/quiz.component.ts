import { Component, ElementRef, NgZone, OnInit, TemplateRef, ViewChild } from '@angular/core';
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
  continueQuiz, QuizUIElementState, State
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
  continueQuiz$: Observable<boolean>;
  enteredResponse: string;
  currentVocabulary: Vocabulary;
  responseState: string;

  constructor(
    private store: Store<State>,
    private ngZone: NgZone,
    private router: Router,
    private route: ActivatedRoute,
    private dialogService: DialogService,
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
        tap(UiElementState => this.responseState = UiElementState.entryFieldState),
        /* tap(UiElementState => {
          if (UiElementState.entryFieldState) {
            this.nextButton.nativeElement.focus();
          }
        }),
        tap(UiElementState => {
          if (UiElementState.entryFieldState) {
            this.quizLearnedLanguageTextArea.nativeElement.focus();
          }
        }) */
      );

    this.continueQuiz$ = this.store.select(continueQuiz)
      .pipe(
        tap((continueWithQuiz) => {
          if (!continueWithQuiz) {
            this.ngZone.run(() => this.router.navigateByUrl(`/${frontend.lessons}`));
          }
        })
      );

    this.errorMessage$ = this.store.select(getError);

    this.store.dispatch(QuizActions.loadQuiz({ lessonID: this.lessonID }));
  }

  checkResponse(): void {
    this.store.dispatch(QuizActions.checkResponse({ response: this.enteredResponse }));
}

  validResponse(): void {
    this.store.dispatch(QuizActions.validResponse());
  }

  invalidResponse(): void {
    this.store.dispatch(QuizActions.invalidResponse());
  }

  next(): void {
    this.store.dispatch(QuizActions.next({vocabularyID: this.currentVocabulary.id, responseState: this.responseState }));
    this.enteredResponse = '';
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
