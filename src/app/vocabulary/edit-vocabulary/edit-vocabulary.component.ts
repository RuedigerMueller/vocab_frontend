import { Component, NgZone, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Lesson } from 'src/app/models/lesson.model.';
import { frontend } from 'src/app/resource.identifiers';
import { LessonService } from 'src/app/services/lesson.service';
import { Vocabulary } from '../../models/vocabulary.model';
import { VocabularyService } from '../../services/vocabulary.service';

@Component({
  selector: 'app-edit-vocabulary',
  templateUrl: './edit-vocabulary.component.html',
  styleUrls: ['./edit-vocabulary.component.scss']
})
export class EditVocabularyComponent implements OnInit {
  vocabulary: Vocabulary;
  lesson: Lesson;
  editVocabularyForm: FormGroup;

  constructor(
    private vocabularyService: VocabularyService,
    private lessonService: LessonService,
    public fb: FormBuilder,
    private ngZone: NgZone,
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    const vocabularyID: string = this.route.snapshot.paramMap.get('vocabularyID');
    const lessonID: string = this.route.snapshot.paramMap.get('lessonID');

    this.lessonService.getLesson(lessonID).subscribe((lesson: Lesson) => {
      this.lesson = lesson;
    });

    this.vocabularyService.getVocabulary(vocabularyID).subscribe((vocabulary: Vocabulary) => {
      this.vocabulary = vocabulary;

      this.editVocabularyForm = this.fb.group({
        language_a: this.vocabulary.language_a,
        language_b: this.vocabulary.language_b,
      });
    });
  }

  submitForm(): void {
    const updatedVocabulary: Vocabulary = this.editVocabularyForm.value;
    updatedVocabulary.level = this.vocabulary.level;
    this.vocabularyService.updateVocabulary(this.vocabulary.id.toString(), this.editVocabularyForm.value).subscribe(res => {
      this.ngZone.run(() => this.router.navigateByUrl(`/${frontend.lessons}/${this.lesson.id}/${frontend.vocabulary}`));
    });
  }

  cancel(): void {
    this.ngZone.run(() => this.router.navigateByUrl(`/${frontend.lessons}/${this.lesson.id}/${frontend.vocabulary}`));
  }
}
