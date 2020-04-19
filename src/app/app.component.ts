import { Component } from '@angular/core';
import { LessonService } from './lesson/lesson.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [LessonService],
})
export class AppComponent {
  title = 'Vocab TS';
}
