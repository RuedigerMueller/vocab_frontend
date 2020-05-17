import { lessonTestData } from './lesson.testdata.spec';
import { Lesson } from 'src/app/lesson/lesson.service.interface';

const testLessons: Lesson[] = lessonTestData;

export const vocabularyTestData = [
    {
      id: 2,
      language_a: 'house',
      language_b: 'Haus',
      level: 1,
      dueDate: Date(),
      lesson: testLessons[0],
    },
    {
      id: 3,
      language_a: 'mouse',
      language_b: 'Maus',
      level: 2,
      dueDate: Date(),
      lesson: testLessons[0],
    },
    {
      id: 5,
      language_a: 'school',
      language_b: 'Schule',
      level: 1,
      dueDate: Date(),
      lesson: testLessons[1],
    },
  ];