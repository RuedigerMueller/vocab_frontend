import { Component, NgZone, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LessonService } from 'src/app/services/lesson.service';
import { Lesson } from 'src/app/models/lesson.model.';
import { frontend } from 'src/app/resource.identifiers';
import { VocabularyService } from '../../services/vocabulary.service';
import { Vocabulary } from '../../models/vocabulary.model';


@Component({
  selector: 'app-list-vocabulary',
  templateUrl: './list-vocabulary.component.html',
  styleUrls: ['./list-vocabulary.component.scss']
})
export class ListVocabularyComponent implements OnInit {
  vocabulary: ReadonlyArray<Vocabulary>;
  lessonID: string;
  lesson: Lesson;

  constructor(
    private vocabularyService: VocabularyService,
    private lessonService: LessonService,
    private ngZone: NgZone,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.lessonID = this.route.snapshot.paramMap.get(frontend.lessonID);
    this.getLesson(this.lessonID);
    this.getVocabulary(this.lessonID);
  }

  createVocabulary(): void {
    this.ngZone.run(() => this.router.navigateByUrl(`/${frontend.lessons}/${this.lessonID}/${frontend.addVocabulary}`));
  }

  getLesson(id: string): void  {
    this.lessonService.getLesson(id).subscribe((lesson: Lesson) => {
      this.lesson = lesson;
    });
  }

  getVocabulary(id: string): void {
    this.vocabularyService.getLessonVocabulary(id).subscribe((vocabulary: Vocabulary[]) => {
      this.vocabulary = vocabulary;
    });
  }

  updateVocabulary(id: string): void {
    this.ngZone.run(() => this.router.navigateByUrl(`/${frontend.lessons}/${this.lessonID}/${frontend.editVocabulary}/${id}`));
  }

  deleteVocabulary(id: string): void {
    this.vocabularyService.deleteVocabulary(id).subscribe(() => {
      this.getVocabulary(this.lessonID);
    });
  }

  closeLesson(): void {
    this.ngZone.run(() => this.router.navigateByUrl(`/${frontend.lessons}`));
  }
}


