import { Component, NgZone, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SignupService } from '../helpers/signup.service';
import { User } from '../models/user.model';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
  username: string;
  password: string;
  passwordRepeat: string;
  firstName: string;
  lastName: string;
  email: string;
  signupForm: FormGroup;
  returnUrl: string;

  constructor(public fb: FormBuilder,
              private route: ActivatedRoute,
              private router: Router,
              private ngZone: NgZone,
              private signupService: SignupService) {

  }

  checkMatchValidator(field1: string, field2: string) {
    return (frm: FormGroup) => {
      const field1Value = frm.get(field1).value;
      const field2Value = frm.get(field2).value;

      if (field1Value !== '' && field1Value !== field2Value) {
        return { notMatch: `value ${field1Value} is not equal to ${field2}` };
      }
      return null;
    };
  }

  ngOnInit(): void {
    this.signupForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      passwordRepeat: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', Validators.required],
    },
    {
      validator: this.checkMatchValidator('password', 'passwordRepeat')
    });
    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams.returnUrl || '/';
  }

  signup(): void {
    // stop here if form is invalid
    if (this.signupForm.invalid) {
      console.log('invalid');
      return;
    }
    console.log('valid');
    const user: User = new User();
    user.username = this.signupForm.value.username;
    user.password = this.signupForm.value.password;
    user.firstName = this.signupForm.value.firstName,
    user.lastName = this.signupForm.value.lastName,
    user.email = this.signupForm.value.email;
    this.signupService.signup(user).subscribe(res => { });
  }
}
