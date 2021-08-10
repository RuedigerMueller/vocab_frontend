import { createAction, props } from '@ngrx/store';
import { Vocabulary } from 'src/app/models/vocabulary.model';

export const loadQuiz = createAction(
    '[Quiz] Load vocabulary',
    props<{ lessonID: number }>()
);

export const loadQuizSuccess = createAction(
    '[Quiz] Load vocabulary success',
    props<{ vocabulary: Vocabulary[] }>()
);

export const loadQuizFailure = createAction(
    '[Quiz] Load vocabulary failure',
    props<{ error: string }>()
);

export const checkResponse = createAction(
    '[Quiz] Check response',
    props<{ response: string }>()
);

export const validResponse = createAction(
    '[Quiz] Valid response'
);

export const invalidResponse = createAction(
    '[Quiz] Invalid response'
);

export const next = createAction(
    '[Quiz] Next',
    props<{ vocabularyID: number, responseState: string }>()
);

export const nextSuccess = createAction(
    '[Quiz] Next success'
);

export const nextFailure = createAction(
    '[Quiz] Next failure',
    props<{ error: string }>()
);

export const updateBackendKnown = createAction(
    '[Quiz] Update Backend with known vocabulary',
    props<{ vocabularyID: number }>()
);

export const updateBackendUnknown = createAction(
    '[Quiz] Update Backend with unknown vocabulary',
    props<{ vocabularyID: number }>()
);
