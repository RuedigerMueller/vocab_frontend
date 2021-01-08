import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  ButtonModule, DialogModule, FormModule, LayoutGridModule, MenuModule,
  MessageStripModule, ShellbarModule, SplitButtonModule, TableModule, LinkModule, LayoutPanelModule, MessageToastModule, TitleModule
} from '@fundamental-ngx/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ErrorInterceptor } from './helpers/error.interceptor';
import { JwtInterceptor } from './helpers/jwt.interceptor';
import { AddLessonComponent } from './lesson/add-lesson/add-lesson.component';
import { EditLessonComponent } from './lesson/edit-lesson/edit-lesson.component';
import { ListLessonsComponent } from './lesson/list-lessons/list-lessons.component';
import { LoginComponent } from './login/login.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { AddVocabularyComponent } from './vocabulary/add-vocabulary/add-vocabulary.component';
import { EditVocabularyComponent } from './vocabulary/edit-vocabulary/edit-vocabulary.component';
import { ListVocabularyComponent } from './vocabulary/list-vocabulary/list-vocabulary.component';
import { QuizComponent } from './vocabulary/quiz/quiz.component';
import { SignupComponent } from './signup/signup.component';
import { EMailValidatorDirective } from './validators/eMailValidator';

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
    SignupComponent,
    EMailValidatorDirective,
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
    LayoutPanelModule,
    FormModule,
    DialogModule,
    LinkModule,
    MessageToastModule,
    TitleModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
