import { environment } from 'src/environments/environment';

export const frontend = {
    lessons: 'lessons',
    createLesson: 'createLesson',
    editLesson: 'editLesson',
    vocabulary: 'vocabulary',
    addVocabulary: 'addVocabulary',
    editVocabulary: 'editVocabulary',
    lessonID: 'lessonID',
    vocabularyID: 'vocabularyID',
    quiz: 'quiz',
};

export const backend = {
    lessons: 'lessons',
    vocabulary: 'vocabulary',
    dueLessonVocabulary: 'dueLessonVocabulary',
    vocabularyKnown: 'vocabKnown',
    vocabularyUnknown: 'vocabUnknown',
    login: 'auth/login',
};

export const baseURL: string = (environment.backendUrl.charAt(environment.backendUrl.length - 1) === '/')
    ? environment.backendUrl.slice(0, -1)
    : environment.backendUrl;
