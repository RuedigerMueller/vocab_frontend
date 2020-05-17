import { Lesson } from '../lesson/lesson.service.interface';

export class Vocabulary {
    id: number;
    language_a: string;
    language_b: string;
    level: number;
    dueDate: Date;
    lesson: number;
}
