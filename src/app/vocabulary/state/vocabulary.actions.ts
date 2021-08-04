import { createAction, props } from '@ngrx/store';
import { Vocabulary } from 'src/app/models/vocabulary.model';

export const loadVocabulary = createAction(
    '[Vocabulary] Load vocabulary',
    props<{ lessonID: number }>()
);

export const loadVocabularySuccess = createAction(
    '[Vocabulary] Load vocabulary success',
    props<{ vocabulary: Vocabulary[] }>()
);

export const loadVocabularyFailure = createAction(
    '[Vocabulary] Load vocabulary failure',
    props<{ error: string }>()
);

export const createVocabulary = createAction(
    '[Vocabulary] Create Vocabulary',
    props<{ vocabulary: Vocabulary }>()
);

export const createVocabularySuccess = createAction(
    '[Vocabulary] Create Vocabulary success',
    props<{ vocabulary: Vocabulary }>()
);

export const createVocabularyFailure = createAction(
    '[Vocabulary] Create Vocabulary failure',
    props<{ error: string }>()
);

export const updateVocabulary = createAction(
    '[Vocabulary] Update vocabulary',
    props<{ vocabularyID: number, vocabulary: Vocabulary}>()
);

export const updateVocabularySuccess = createAction(
    '[Vocabulary] Update vocabulary success',
    props<{ vocabularyID: number, vocabulary: Vocabulary }>()
);

export const updateVocabularyFailure = createAction(
    '[Vocabulary] Update vocabulary failure',
    props<{ error: string }>()
);

export const deleteVocabulary = createAction(
    '[Vocabulary] Delete vocabulary',
    props<{ vocabularyID: number }>()
);

export const deleteVocabularySuccess = createAction(
    '[Vocabulary] Delete vocabulary success',
    props<{ vocabularyID: number }>()
);

export const deleteVocabularyFailure = createAction(
    '[Vocabulary] Delete vocabulary failure',
    props<{ error: string }>()
);

