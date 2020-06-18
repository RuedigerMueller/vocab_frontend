import { Component } from '@angular/core';
import { LessonService } from './services/lesson.service';
import { User } from './models/user.model';
import { Router } from '@angular/router';
import { AuthService } from './helpers/auth.service';
import { ShellbarUser, ShellbarUserMenu } from '@fundamental-ngx/core';

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
    this.authenticationService.getCurrentUser().subscribe((user: User) => {
      this.currentUser = user;
      if ( this.currentUser) {
        if ((this.currentUser.firstName) && (this.currentUser.lastName)) {
          this.shellbarUser.initials = this.currentUser.firstName[0] + this.currentUser.lastName[0];
        } else {
          this.shellbarUser.initials = '';
        }
      }
    });
  }

  shellbarUser: ShellbarUser = {
    initials: '',
    colorAccent: 11
  };

  userMenu: ShellbarUserMenu[] = [
    // { text: 'Settings', callback: this.settingsCallback },
    { text: 'Logout', callback: this.logout.bind(this) }
  ];


  logout() {
    this.authenticationService.logout();
    this.router.navigate(['/login']);
  }
}
