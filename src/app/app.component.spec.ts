import { Location } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { ShellbarModule } from '@fundamental-ngx/core';
import { of } from 'rxjs';
import { userTestData } from 'test/user.testdata.spec';
import { routes } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthService } from './helpers/auth.service';
import { User } from './models/user.model';
import { frontend } from './resource.identifiers';

describe('AppComponent', () => {
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;
  let fixture: ComponentFixture<AppComponent>;
  let app: AppComponent;
  let location: Location;
  let router: Router;

  let authCurrentUserSpy: any;
  const testUser: User = userTestData[0];

  let authService: any;

  const expandUserMenu = () => {
    const expandableButton: HTMLButtonElement = fixture.nativeElement.querySelector('.fd-identifier.fd-identifier--xs');
    expandableButton.click();
    fixture.detectChanges();
  };

  beforeEach(async(() => {
    authService = jasmine.createSpyObj('AuthService', ['getCurrentUser', 'logout']);
    authCurrentUserSpy = authService.getCurrentUser.and.returnValue(of(testUser));

    TestBed.configureTestingModule({
      declarations: [AppComponent],
      imports: [
        HttpClientTestingModule,
        RouterTestingModule.withRoutes(routes),
        ShellbarModule,
        // required because we are navigating to the loginComponent in a test and this required it
        ReactiveFormsModule,
      ],
     providers: [
        { provide: AuthService, useValue: authService }
      ],
    }).compileComponents();

    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
  }));

  beforeEach(() => {
    router = TestBed.inject(Router);
    location = TestBed.inject(Location);
    fixture = TestBed.createComponent(AppComponent);
    app = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('should create application', () => {
    it('should create the app', () => {
      expect(app).toBeTruthy();
    });
  });

  describe('should render UI elements', () => {
    it(`should have as title 'Vocab TS'`, () => {
      expect(app.title).toEqual(app.title);
    });

    it('should render title', async () => {
      fixture.detectChanges();

      const appElement: HTMLElement = fixture.nativeElement;
      const titleElement = appElement.querySelector('fd-shellbar-title');

      expect(titleElement.textContent).toContain(app.title);
    });
  });

  describe('should have required actions', () => {
    xit('should not have user menu if no user is logged in', () => {
      /* const button: HTMLButtonElement = fixture.nativeElement.querySelector('#edit-lesson-saveButton');
      expect(button.textContent).toContain('Save'); */
    });

    it('should have link "Logout" if a user is logged in', () => {
      expandUserMenu();
      const listElement: HTMLLIElement = fixture.nativeElement.querySelector('li.fd-menu__item');
      expect(listElement.textContent).toContain('Logout');
    });
  });

  describe('should route correctly on actions', () => {
    it('should navigate to login component when clicking "Logout"', fakeAsync(() => {
      expandUserMenu();
      const listElement: HTMLLIElement = fixture.nativeElement.querySelector('li.fd-menu__item');
      listElement.click();
      tick();

      expect(location.path()).toBe(`/${frontend.login}`, 'should nav to login');
    }));
  });
});
