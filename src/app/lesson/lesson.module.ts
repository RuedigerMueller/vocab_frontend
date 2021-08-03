import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { lessonReducer } from './state/lesson.reducer';
import { LessonEffects } from '../lesson/state/lesson.effects';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    StoreModule.forFeature('lesson', lessonReducer),
    EffectsModule.forFeature([LessonEffects])
  ]
})
export class LessonModule { }
