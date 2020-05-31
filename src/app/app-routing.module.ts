import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddLessonComponent } from './lesson/add-lesson/add-lesson.component';
import { EditLessonComponent } from './lesson/edit-lesson/edit-lesson.component';
import { ListLessonsComponent } from './lesson/list-lessons/list-lessons.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { frontend } from './resource.identifiers';
import { AddVocabularyComponent } from './vocabulary/add-vocabulary/add-vocabulary.component';
import { EditVocabularyComponent } from './vocabulary/edit-vocabulary/edit-vocabulary.component';
import { ListVocabularyComponent } from './vocabulary/list-vocabulary/list-vocabulary.component';
import { QuizComponent } from './vocabulary/quiz/quiz.component';
import { LoginComponent } from './login/login.component';
import { AuthGuardService as AuthGuard } from './helpers/auth-guard.service';


export const routes: Routes = [
  {
    path: frontend.lessons,
    component: ListLessonsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: `${frontend.lessons}/${frontend.createLesson}`,
    component: AddLessonComponent,
    canActivate: [AuthGuard]
  },
  {
    path: `${frontend.lessons}/:${frontend.lessonID}/${frontend.editLesson}`,
    component: EditLessonComponent,
    canActivate: [AuthGuard]
  },
  {
    path: `${frontend.lessons}/:${frontend.lessonID}/${frontend.vocabulary}`,
    component: ListVocabularyComponent,
    canActivate: [AuthGuard]
  },
  {
    path: `${frontend.lessons}/:${frontend.lessonID}/${frontend.addVocabulary}`,
    component: AddVocabularyComponent,
    canActivate: [AuthGuard]
  },
  {
    path: `${frontend.lessons}/:${frontend.lessonID}/${frontend.quiz}`,
    component: QuizComponent,
    canActivate: [AuthGuard]
  },
  {
    path: `${frontend.lessons}/:${frontend.lessonID}/${frontend.editVocabulary}/:${frontend.vocabularyID}`,
    component: EditVocabularyComponent,
    canActivate: [AuthGuard]
  },
  {
    path: '',
    redirectTo: frontend.lessons,
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: '**',
    component: PageNotFoundComponent
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
