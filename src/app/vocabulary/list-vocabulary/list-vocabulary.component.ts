import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Vocabulary } from '../vocabulary.service.interface';
import { VocabularyService } from '../vocabulary.service';


@Component({
  selector: 'app-list-vocabulary',
  templateUrl: './list-vocabulary.component.html',
  styleUrls: ['./list-vocabulary.component.scss']
})
export class ListVocabularyComponent implements OnInit {
  vocabulary: ReadonlyArray<Vocabulary>;
  lessonID: string;

  constructor(
    private vocabularyService: VocabularyService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.lessonID = this.route.snapshot.paramMap.get('id');
    this.getVocabulary(this.lessonID);
  }

  getVocabulary(id: string): void {
    this.vocabularyService.getVocabulary(id).subscribe((vocabulary: Vocabulary[]) => {
      this.vocabulary = vocabulary;
    });
  }

  createVocabulary(): void {

  }

  updateVocabulary(id: string): void {

  }

  deleteVocabulary(id: string): void {
    this.vocabularyService.deleteVocabulary(id).subscribe(() => {
      this.getVocabulary(this.lessonID);
    });
  }
}


