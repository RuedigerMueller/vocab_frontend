import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  userEmail: string;
  userPassword: string;
  loginForm: FormGroup;

  constructor(private authService: AuthService, private router: Router, public fb: FormBuilder) { }

  ngOnInit() {
    this.loginForm = this.fb.group({
      eMail: ['john@example.com'],
      password: ['changeme']
    });

  }

  login() {
    this.authService.validate(this.loginForm.value.eMail, this.loginForm.value.password)
      .then((response) => {
        this.authService.setUserInfo(response);
        this.router.navigate(['lessons']);
      });
  }
}
