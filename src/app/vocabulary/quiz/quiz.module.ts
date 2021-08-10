import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { quizReducer } from './state/quiz.reducer';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { QuizEffects } from './state/quiz.effects';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    StoreModule.forFeature('quiz', quizReducer),
    EffectsModule.forFeature([QuizEffects])
  ]
})
export class QuizModule { }
