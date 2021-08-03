import { createAction, props } from '@ngrx/store';
import { Vocabulary } from 'src/app/models/vocabulary.model';

export const loadVocabulary = createAction(
    '[Vocabulary] Load vocabulary',
    props<{ lessonID: string }>()
);

export const loadVocabularySuccess = createAction(
    '[Vocabulary] Load vocabulary success',
    props<{ vocabulary: Vocabulary[] }>()
);

export const loadVocabularyFailure = createAction(
    '[Vocabulary] Load vocabulary failure',
    props<{ error: string }>()
);
