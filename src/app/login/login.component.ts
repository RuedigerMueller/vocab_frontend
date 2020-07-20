import { Component, OnInit, NgZone } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../helpers/auth.service';
import { first } from 'rxjs/operators';
import { User } from '../models/user.model';
import { frontend } from 'src/app/resource.identifiers';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  userEmail: string;
  userPassword: string;
  loginForm: FormGroup;
  returnUrl: string;
  error = '';


  constructor(
    private authService: AuthService, private route: ActivatedRoute, 
    private router: Router, public fb: FormBuilder, private ngZone: NgZone
    ) {
    // redirect to home if already logged in
    if (this.authService.currentUserValue) {
      this.router.navigate(['/']);
    }
  }

  ngOnInit() {
    this.loginForm = this.fb.group({
      eMail: ['john@example.com', Validators.required],
      password: ['changeme', Validators.required],
    });

    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams.returnUrl || '/';
  }

  login() {
    // stop here if form is invalid
    if (this.loginForm.invalid) {
      return;
    }

    this.authService.login(this.loginForm.value.eMail, this.loginForm.value.password)
      .pipe(first())
      .subscribe(
        (user: User) => {
          // this.router.navigate([this.returnUrl]);
          this.ngZone.run(() => this.router.navigateByUrl(this.returnUrl));
        },
        error => {
          this.error = error;
        }
      );
  }
}
