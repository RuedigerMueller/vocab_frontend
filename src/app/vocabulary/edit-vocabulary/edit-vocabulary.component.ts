import { Component, OnInit, NgZone } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Vocabulary } from '../vocabulary.service.interface';
import { Router, ActivatedRoute } from '@angular/router';
import { VocabularyService } from '../vocabulary.service';

@Component({
  selector: 'app-edit-vocabulary',
  templateUrl: './edit-vocabulary.component.html',
  styleUrls: ['./edit-vocabulary.component.scss']
})
export class EditVocabularyComponent implements OnInit {
  editVocabularyForm: FormGroup;
  vocabulary: Vocabulary;

  constructor(
    public fb: FormBuilder,
    private ngZone: NgZone,
    private router: Router,
    private route: ActivatedRoute,
    private vocabularyService: VocabularyService
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    this.vocabularyService.getVocabulary(id).subscribe((vocabulary: Vocabulary) => {
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
      console.log('Vocabulary updated!');

      // ToDo: navigation target
      this.ngZone.run(() => this.router.navigateByUrl('/lessons'));
    });
  }

  cancel(): void {
    // ToDo: Should return to /lesson/:id/vocabulary => need to know the lesson ID :-(
    this.ngZone.run(() => this.router.navigateByUrl('/lessons'));
  }
}
