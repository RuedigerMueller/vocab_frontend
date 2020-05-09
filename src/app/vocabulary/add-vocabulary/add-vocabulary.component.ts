import { Component, OnInit, NgZone } from '@angular/core';
import { VocabularyService } from '../vocabulary.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-vocabulary',
  templateUrl: './add-vocabulary.component.html',
  styleUrls: ['./add-vocabulary.component.scss']
})
export class AddVocabularyComponent implements OnInit {
  vocabularyForm: FormGroup;

  constructor(
    public fb: FormBuilder,
    private ngZone: NgZone,
    private router: Router,
    private vocabularyService: VocabularyService
  ) { }

  ngOnInit(): void {
    this.vocabularyForm = this.fb.group({
      language_a: [''],
      language_b: ['']
    });
  }

  submitForm() {
    this.vocabularyService.createVocabulary(this.vocabularyForm.value).subscribe(res => {
      console.log('Vocabulary added!');
      //this.ngZone.run(() => this.router.navigateByUrl('/lessons'));
      
      // ToDo -> where to route to???
      this.router.navigateByUrl('/lessons');
    });
  }

}
