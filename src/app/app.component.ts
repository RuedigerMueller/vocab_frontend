import { Component } from '@angular/core';
import { LessonService } from './services/lesson.service';
import { User } from './models/user.model';
import { Router } from '@angular/router';
import { AuthService } from './helpers/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [LessonService],
})
export class AppComponent {
  title = 'Vocab TS';

  currentUser: User;

  constructor(
    private router: Router,
    private authenticationService: AuthService
  ) {
    this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
  }

  logout() {
    this.authenticationService.logout();
    this.router.navigate(['/login']);
  }
}
