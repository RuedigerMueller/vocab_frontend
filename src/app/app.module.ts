import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ShellbarModule, TableModule, ButtonModule, FormModule} from '@fundamental-ngx/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AddLessonComponent } from './lesson/add-lesson/add-lesson.component';
import { EditLessonComponent } from './lesson/edit-lesson/edit-lesson.component';
import { ListLessonsComponent } from './lesson/list-lessons/list-lessons.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ListVocabulariesComponent } from './vocabulary/list-vocabularies/list-vocabularies.component';

@NgModule({
  declarations: [
    AppComponent,
    AddLessonComponent,
    EditLessonComponent,
    ListLessonsComponent,
    ListVocabulariesComponent
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
    FormModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
