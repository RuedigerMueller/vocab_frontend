import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListLessonsComponent } from './lesson/list-lessons/list-lessons.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { AddLessonComponent } from './lesson/add-lesson/add-lesson.component';
import { EditLessonComponent } from './lesson/edit-lesson/edit-lesson.component';
import { ListVocabularyComponent } from './vocabulary/list-vocabulary/list-vocabulary.component';
import { AddVocabularyComponent } from './vocabulary/add-vocabulary/add-vocabulary.component';
import { EditVocabularyComponent } from './vocabulary/edit-vocabulary/edit-vocabulary.component';
import { frontend } from './resource.identifiers';


export const routes: Routes = [
  { path: frontend.lessons, component: ListLessonsComponent },
  { path: `${frontend.lessons}/${frontend.createLesson}`, component: AddLessonComponent },
  { path: `${frontend.lessons}/:${frontend.lessonID}/${frontend.editLesson}`, component: EditLessonComponent },
  { path: `${frontend.lessons}/:${frontend.lessonID}/${frontend.vocabulary}`, component: ListVocabularyComponent },
  { path: `${frontend.lessons}/:${frontend.lessonID}/${frontend.addVocabulary}`, component: AddVocabularyComponent },
  {
    path: `${frontend.lessons}/:${frontend.lessonID}/${frontend.editVocabulary}/:${frontend.vocabularyID}`, 
    component: EditVocabularyComponent
  },
  { path: '',
    redirectTo: frontend.lessons,
    pathMatch: 'full'
  },
  { path: '**', component: PageNotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
