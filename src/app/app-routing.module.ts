import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListLessonsComponent } from './lesson/list-lessons/list-lessons.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { AddLessonComponent } from './lesson/add-lesson/add-lesson.component';
import { EditLessonComponent } from './lesson/edit-lesson/edit-lesson.component';
import { ListVocabularyComponent } from './vocabulary/list-vocabulary/list-vocabulary.component';
import { AddVocabularyComponent } from './vocabulary/add-vocabulary/add-vocabulary.component';
import { EditVocabularyComponent } from './vocabulary/edit-vocabulary/edit-vocabulary.component';


const routes: Routes = [
  { path: 'lessons', component: ListLessonsComponent },
  { path: 'createLesson', component: AddLessonComponent },
  { path: 'editLesson/:id', component: EditLessonComponent },
  { path: 'lesson/:id/vocabulary', component: ListVocabularyComponent },
  { path: 'addVocabulary/:lessonID', component: AddVocabularyComponent },
  { path: 'editVocabulary/:id', component: EditVocabularyComponent },
  { path: '',
    redirectTo: '/lessons',
    pathMatch: 'full'
  },
  { path: '**', component: PageNotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
