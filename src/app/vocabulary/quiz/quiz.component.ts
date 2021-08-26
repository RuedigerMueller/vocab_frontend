import { Component, NgZone, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonComponent, DialogService, FormControlComponent } from '@fundamental-ngx/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { selectLessonByID } from 'src/app/lesson/state/lesson.reducer';
import { Lesson } from 'src/app/models/lesson.model.';
import { frontend } from 'src/app/resource.identifiers';
import { Vocabulary } from '../../models/vocabulary.model';
import * as fromActions from './state/quiz.actions';
import * as fromReducer from './state/quiz.reducer';

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
  UIElementState$: Observable<fromReducer.QuizUIElementState>;
  errorMessage$: Observable<string>;
  continueQuiz$: Observable<boolean>;
  enteredResponse: string;
  currentVocabulary: Vocabulary;
  responseState: string;

  constructor(
    private store: Store<fromReducer.State>,
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
    this.numberDueVocabularies$ = this.store.select(fromReducer.getNumberDueVocabularies);
    this.questionedVocabulary$ = this.store.select(fromReducer.getNumberQuestionedVocabularies);
    this.numberKnownVocabularies$ = this.store.select(fromReducer.getNumberKnownVocabularies);
    this.numberUnknownVocabularies$ = this.store.select(fromReducer.getNumberUnknownVocabularies);
    this.currentVocabulary$ = this.store.select(fromReducer.getCurrentVocabulary)
      .pipe(
        tap(currentVocabulary => this.currentVocabulary = currentVocabulary)
      );
    this.UIElementState$ = this.store.select(fromReducer.getUIElementState)
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

    this.continueQuiz$ = this.store.select(fromReducer.continueQuiz)
      .pipe(
        tap((continueWithQuiz) => {
          if (!continueWithQuiz) {
            // this.store.dispatch(fromActions.clearState());
            this.ngZone.run(() => this.router.navigateByUrl(`/${frontend.lessons}`));
          }
        })
      );

    this.errorMessage$ = this.store.select(fromReducer.getError);

    this.store.dispatch(fromActions.loadQuiz({ lessonID: this.lessonID }));
  }

  checkResponse(): void {
    this.store.dispatch(fromActions.checkResponse({ response: this.enteredResponse }));
  }

  validResponse(): void {
    this.store.dispatch(fromActions.validResponse());
  }

  invalidResponse(): void {
    this.store.dispatch(fromActions.invalidResponse());
  }

  next(): void {
    this.store.dispatch(fromActions.next({ vocabularyID: this.currentVocabulary.id, responseState: this.responseState }));
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
