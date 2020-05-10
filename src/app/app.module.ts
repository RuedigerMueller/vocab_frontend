import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ShellbarModule, TableModule, ButtonModule, FormModule, SplitButtonModule, MenuModule} from '@fundamental-ngx/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AddLessonComponent } from './lesson/add-lesson/add-lesson.component';
import { EditLessonComponent } from './lesson/edit-lesson/edit-lesson.component';
import { ListLessonsComponent } from './lesson/list-lessons/list-lessons.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ListVocabularyComponent } from './vocabulary/list-vocabulary/list-vocabulary.component';
import { AddVocabularyComponent } from './vocabulary/add-vocabulary/add-vocabulary.component';
import { EditVocabularyComponent } from './vocabulary/edit-vocabulary/edit-vocabulary.component';

@NgModule({
  declarations: [
    AppComponent,
    AddLessonComponent,
    EditLessonComponent,
    ListLessonsComponent,
    ListVocabularyComponent,
    AddVocabularyComponent,
    EditVocabularyComponent
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
    MenuModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
