import { Location } from '@angular/common';
import { HttpClientTestingModule, HttpTestingController, TestRequest } from '@angular/common/http/testing';
import { DebugElement } from '@angular/core';
import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { userTestData } from 'test/user.testdata.spec';
import { routes } from '../app-routing.module';
import { AuthGuardService } from '../helpers/auth-guard.service';
import { AuthService } from '../helpers/auth.service';
import { User } from '../models/user.model';
import { backend, baseURL } from '../resource.identifiers';
import { LoginComponent } from './login.component';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let httpTestingController: HttpTestingController;
  let location: Location;

  const user_1: User = userTestData[0];

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [
        HttpClientTestingModule,
        RouterTestingModule.withRoutes(routes),
        ReactiveFormsModule,
      ],
      providers: [
        AuthGuardService,
        AuthService,
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              queryParams: {
                returnUrl: '/lessons'
              }
            }
          }
        },
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    location = TestBed.inject(Location);
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('should route correctly on actions', () => {
    it('should navigate to return URL component when clicking "Login"', fakeAsync(() => {
      component.loginForm.value.eMail = user_1.email;
      component.loginForm.value.password = user_1.password;
      const loginButton: HTMLButtonElement = fixture.nativeElement.querySelector('#login-loginButton');
      loginButton.click();

      // Mock request to backend
      const req: TestRequest = httpTestingController.expectOne(`${baseURL}/${backend.login}`);
      expect(req.request.method).toBe('POST');
      req.flush({username: user_1.email, password: user_1.password});
      httpTestingController.verify();

      tick();
      expect(location.path()).toBe(component.returnUrl, 'should nav to return URL');
    }));
  });

  describe('should support keyboard navigation', () => {
    it('lesson user e-Mail should have autofocus', () => {
      const inputDE: DebugElement = fixture.debugElement.query(By.css('#login-userEmail'));
      const inputElement: HTMLInputElement = inputDE.nativeElement;
      expect(inputElement.autofocus).toBeTrue();
    });

    it('should only have one autofocus element', () => {
      const items: ReadonlyArray<HTMLElement> = fixture.nativeElement.getElementsByTagName('*');
      let counter = 0;
      for (let i = items.length; i--;) {
        if (items[i].autofocus === true) { counter++; }
      }
      expect(counter).toEqual(1);
    });
  });
});
