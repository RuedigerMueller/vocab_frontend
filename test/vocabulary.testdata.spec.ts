import { lessonTestData } from './lesson.testdata.spec';
import { Lesson } from 'src/app/models/lesson.model.';
import { Vocabulary } from 'src/app/models/vocabulary.model';

function createVocabulary(
  id: number,
  language_a: string,
  language_b: string,
  level: number,
  dueDate: Date,
  lesson: number,
): Vocabulary {
  const vocabulary: Vocabulary = new Vocabulary();
  vocabulary.id = id;
  vocabulary.language_a = language_a;
  vocabulary.language_b = language_b;
  vocabulary.level = level;
  vocabulary.dueDate = dueDate;
  vocabulary.lesson = lesson;
  return vocabulary;
}

const testLessons: Lesson[] = lessonTestData;

export let vocabularyTestData: ReadonlyArray<Vocabulary> = [];

vocabularyTestData = vocabularyTestData.concat(
  createVocabulary(2, 'house', 'Haus', 1, new Date(2020, 2, 29), testLessons[0].id),
);
vocabularyTestData = vocabularyTestData.concat(
  createVocabulary(3, 'mouse', ';aus', 2, new Date(2020, 2, 29), testLessons[0].id),
);
vocabularyTestData = vocabularyTestData.concat(
  createVocabulary(5, 'school', 'Schule', 1, new Date(2020, 2, 29), testLessons[1].id),
);
