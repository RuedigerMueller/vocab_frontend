import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  ButtonModule, FormModule, LayoutGridModule, MenuModule,
  MessageStripModule, PanelModule, ShellbarModule, SplitButtonModule, TableModule
} from '@fundamental-ngx/core';
import { JwtInterceptor } from './helpers/jwt.interceptor';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AddLessonComponent } from './lesson/add-lesson/add-lesson.component';
import { EditLessonComponent } from './lesson/edit-lesson/edit-lesson.component';
import { ListLessonsComponent } from './lesson/list-lessons/list-lessons.component';
import { LoginComponent } from './login/login.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { AddVocabularyComponent } from './vocabulary/add-vocabulary/add-vocabulary.component';
import { EditVocabularyComponent } from './vocabulary/edit-vocabulary/edit-vocabulary.component';
import { ListVocabularyComponent } from './vocabulary/list-vocabulary/list-vocabulary.component';
import { QuizComponent } from './vocabulary/quiz/quiz.component';
import { ErrorInterceptor } from './helpers/error.interceptor';
import { VocabFocusDirective } from './directives/vocab-focus.directive';

@NgModule({
  declarations: [
    AppComponent,
    AddLessonComponent,
    EditLessonComponent,
    ListLessonsComponent,
    ListVocabularyComponent,
    AddVocabularyComponent,
    EditVocabularyComponent,
    PageNotFoundComponent,
    QuizComponent,
    LoginComponent,
    VocabFocusDirective
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ShellbarModule,
    TableModule,
    ButtonModule,
    FormModule,
    SplitButtonModule,
    MenuModule,
    MessageStripModule,
    LayoutGridModule,
    PanelModule,
    FormModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
