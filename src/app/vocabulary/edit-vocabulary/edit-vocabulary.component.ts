import { Component, OnInit, NgZone } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Vocabulary } from '../vocabulary.service.interface';
import { Router, ActivatedRoute } from '@angular/router';
import { VocabularyService } from '../vocabulary.service';
import { LessonService } from 'src/app/lesson/lesson.service';
import { Lesson } from 'src/app/lesson/lesson.service.interface';
import { frontend } from 'src/app/resource.identifiers';

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
