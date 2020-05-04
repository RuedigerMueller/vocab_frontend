import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Vocabulary } from '../vocabulary.service.interface';
import { VocabularyService } from '../vocabulary.service';


@Component({
  selector: 'app-list-vocabularies',
  templateUrl: './list-vocabularies.component.html',
  styleUrls: ['./list-vocabularies.component.scss']
})
export class ListVocabulariesComponent implements OnInit {
  vocabularies: ReadonlyArray<Vocabulary>;

  constructor(
    private vocabularyService: VocabularyService, 
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    this.vocabularyService.getVocabularies(id);
  }
}
