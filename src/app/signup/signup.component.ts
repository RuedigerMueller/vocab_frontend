import { AfterViewChecked, Component, NgZone, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageToastService } from '@fundamental-ngx/core';
import { SignupService } from '../services/signup.service';
import { User } from '../models/user.model';
import { EMailValidator } from '../validators/eMailValidator';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit, AfterViewChecked {
  username: string;
  password: string;
  passwordRepeat: string;
  firstName: string;
  lastName: string;
  email: string;
  signupForm: FormGroup;
  returnUrl: string;
  error = '';
  state = {
    username: '',
    password: '',
    passwordRepeat: '',
    firstName: '',
    lastName: '',
    email: ''
  }

  constructor(public fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private ngZone: NgZone,
    private signupService: SignupService,
    public messageToastService: MessageToastService
  ) { }

  checkMatchValidator(field1: string, field2: string) {
    return (frm: FormGroup) => {
      const field1Value = frm.get(field1).value;
      const field2Value = frm.get(field2).value;

      if (field1Value !== '' && field1Value !== field2Value) {
        return { passwordMismatch: true };
      }
      return null;
    };
  }

  ngAfterViewChecked() {
    if (this.state.username === 'error') {
      this.signupForm.controls.username.errors ? this.state.username = 'error' : this.state.username = '';
    }
    if (this.state.password === 'error') {
      this.signupForm.controls.password.errors ? this.state.password = 'error' : this.state.password = '';
    }
    if (this.state.passwordRepeat === 'error') {
      this.signupForm.controls.passwordRepeat.errors ? this.state.passwordRepeat = 'error' : this.state.passwordRepeat = '';
    }
    if (this.state.firstName === 'error') {
      this.signupForm.controls.firstName.errors ? this.state.firstName = 'error' : this.state.firstName = '';
    }
    if (this.state.lastName === 'error') {
      this.signupForm.controls.lastName.errors ? this.state.lastName = 'error' : this.state.lastName = '';
    }
    if (this.state.email === 'error') {
      this.signupForm.controls.email.errors ? this.state.email = 'error' : this.state.email = '';
    }
  }

  ngOnInit(): void {
    this.signupForm = this.fb.group(
      {
        username: ['', Validators.required],
        password: ['', [Validators.required, Validators.minLength(8)]],
        passwordRepeat: ['', [Validators.required, Validators.minLength(8)]],
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        email:
          [
            '',
            [Validators.required],
            [EMailValidator(this.signupService)],
            // { updateOn: 'blur' }
          ]
      },
      {
        validators: this.checkMatchValidator('password', 'passwordRepeat')
      }
    );
    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams.returnUrl || '/';
  }

  signup(): void {
    // stop here if form is invalid
    if (this.signupForm.invalid) {
      this.signupForm.controls.username.errors ? this.state.username = 'error' : this.state.username = '';
      this.signupForm.controls.password.errors ? this.state.password = 'error' : this.state.password = '';
      this.signupForm.controls.passwordRepeat.errors ? this.state.passwordRepeat = 'error' : this.state.passwordRepeat = '';
      this.signupForm.controls.firstName.errors ? this.state.firstName = 'error' : this.state.firstName = '';
      this.signupForm.controls.lastName.errors ? this.state.lastName = 'error' : this.state.lastName = '';
      this.signupForm.controls.email.errors ? this.state.email = 'error' : this.state.email = '';
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
    this.signupService.signup(user).subscribe(
      res => {
        const content = 'User created - you can now log in!';
        this.messageToastService.open(content, {
          duration: 5000
        });
        this.ngZone.run(() => this.router.navigateByUrl(this.returnUrl));
      },
      error => {
        this.error = error;
        const content = `Could not create user: ${error}`;
        this.messageToastService.open(content, {
          duration: 5000
        });
      }
    );
  }

  get f() { return this.signupForm.controls; }
}
