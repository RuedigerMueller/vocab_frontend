import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListLessonsComponent } from './lesson/list-lessons/list-lessons.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { AddLessonComponent } from './lesson/add-lesson/add-lesson.component';
import { EditLessonComponent } from './lesson/edit-lesson/edit-lesson.component';
import { ListVocabulariesComponent } from './vocabulary/list-vocabularies/list-vocabularies.component';


const routes: Routes = [
  { path: 'lessons', component: ListLessonsComponent },
  { path: 'createLesson', component: AddLessonComponent },
  { path: 'editLesson/:id', component: EditLessonComponent },
  { path: 'lesson/:id/vocabularies', component: ListVocabulariesComponent },
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
