import { Component, OnInit, NgZone } from '@angular/core';
import { VocabularyService } from '../vocabulary.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Vocabulary } from '../vocabulary.service.interface';

@Component({
  selector: 'app-add-vocabulary',
  templateUrl: './add-vocabulary.component.html',
  styleUrls: ['./add-vocabulary.component.scss']
})
export class AddVocabularyComponent implements OnInit {
  lessonID: string;
  vocabularyForm: FormGroup;

  constructor(
    public fb: FormBuilder,
    private ngZone: NgZone,
    private router: Router,
    private route: ActivatedRoute,
    private vocabularyService: VocabularyService
  ) { }

  ngOnInit(): void {
    this.lessonID = this.route.snapshot.paramMap.get('lessonID');
    this.vocabularyForm = this.fb.group({
      language_a: [''],
      language_b: ['']
    });
  }

  submitForm(): void {
    const vocabulary: Vocabulary = this.vocabularyForm.value;
    vocabulary.lesson = parseInt(this.lessonID, 10);
    this.vocabularyService.createVocabulary(vocabulary).subscribe(res => {
      console.log('Vocabulary added!');
    });
    this.vocabularyForm = this.fb.group({
      language_a: [''],
      language_b: ['']
    });
  }

  cancel(): void {
    this.ngZone.run(() => this.router.navigateByUrl('/lesson' + '/' + this.lessonID + '/' + 'vocabulary'));
  }
}
