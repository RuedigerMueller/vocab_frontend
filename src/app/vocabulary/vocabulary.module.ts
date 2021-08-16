import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { VocabularyEffects } from '../vocabulary/state/vocabulary.effects';
import { vocabularyReducer } from './state/vocabulary.reducer';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    StoreModule.forFeature('lessonVocabulary', vocabularyReducer),
    EffectsModule.forFeature([VocabularyEffects])
  ]
})
export class VocabularyModule { }
