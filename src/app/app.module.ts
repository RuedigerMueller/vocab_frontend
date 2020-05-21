import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ButtonModule, FormModule, MenuModule, MessageStripModule, ShellbarModule, SplitButtonModule, TableModule } from '@fundamental-ngx/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AddLessonComponent } from './lesson/add-lesson/add-lesson.component';
import { EditLessonComponent } from './lesson/edit-lesson/edit-lesson.component';
import { ListLessonsComponent } from './lesson/list-lessons/list-lessons.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { AddVocabularyComponent } from './vocabulary/add-vocabulary/add-vocabulary.component';
import { EditVocabularyComponent } from './vocabulary/edit-vocabulary/edit-vocabulary.component';
import { ListVocabularyComponent } from './vocabulary/list-vocabulary/list-vocabulary.component';

@NgModule({
  declarations: [
    AppComponent,
    AddLessonComponent,
    EditLessonComponent,
    ListLessonsComponent,
    ListVocabularyComponent,
    AddVocabularyComponent,
    EditVocabularyComponent,
    PageNotFoundComponent
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
    MessageStripModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
