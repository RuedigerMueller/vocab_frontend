import { Component, OnInit, NgZone } from '@angular/core';
import { VocabularyService } from '../../services/vocabulary.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Vocabulary } from '../../models/vocabulary.model';
import { Lesson } from 'src/app/models/lesson.model.';
import { LessonService } from 'src/app/services/lesson.service';
import { frontend } from 'src/app/resource.identifiers';

@Component({
  selector: 'app-add-vocabulary',
  templateUrl: './add-vocabulary.component.html',
  styleUrls: ['./add-vocabulary.component.scss']
})
export class AddVocabularyComponent implements OnInit {
  lesson: Lesson;
  addVocabularyForm: FormGroup;

  constructor(
    private vocabularyService: VocabularyService,
    private lessonService: LessonService,
    public fb: FormBuilder,
    private ngZone: NgZone,
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    const lessonID: string = this.route.snapshot.paramMap.get(`${frontend.lessonID}`);

    this.lessonService.getLesson(lessonID).subscribe((lesson: Lesson) => {
      this.lesson = lesson;
    });

    this.addVocabularyForm = this.fb.group({
      language_a: [''],
      language_b: ['']
    });
  }

  submitForm(): void {
    const vocabulary: Vocabulary = this.addVocabularyForm.value;
    vocabulary.lesson = this.lesson.id;
    this.vocabularyService.createVocabulary(vocabulary).subscribe(res => { });
    this.addVocabularyForm = this.fb.group({
      language_a: [''],
      language_b: ['']
    });
  }

  cancel(): void {
    this.ngZone.run(() => this.router.navigateByUrl(`/${frontend.lessons}/${this.lesson.id}/${frontend.vocabulary}`));
  }
}
