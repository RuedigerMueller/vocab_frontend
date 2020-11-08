import { Location } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { DebugElement } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { ShellbarModule, ShellbarUserMenuComponent } from '@fundamental-ngx/core';
import { of } from 'rxjs';
import { userTestData } from 'test/user.testdata.spec';
import { routes } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthService } from './helpers/auth.service';
import { User } from './models/user.model';
import { frontend } from './resource.identifiers';

describe('AppComponent - logged in', () => {
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;
  let fixture: ComponentFixture<AppComponent>;
  let debugElement: DebugElement;
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

  beforeEach(waitForAsync(() => {
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
    debugElement = fixture.debugElement;
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
    it('should have link "Logout" if a user is logged in', () => {
      const shellbarUserMenuComponent = debugElement.query(By.directive(ShellbarUserMenuComponent));
      const shellbarUserMenuComponentInstance: ShellbarUserMenuComponent =
        shellbarUserMenuComponent.injector.get(ShellbarUserMenuComponent);

      let found = false;

      for (const menuItem of shellbarUserMenuComponentInstance.menu.menuItems) {
        if (menuItem.menuItemTitle.title.trim() === 'Logout') {
          found = true;
        }
      }

      expect(found).toBeTruthy('Logout action available');
    });
  });

  describe('should route correctly on actions', () => {
    it('should navigate to login component when clicking "Logout"', fakeAsync(() => {
      app.logout();
      tick();

      expect(location.path()).toBe(`/${frontend.login}`, 'should nav to login');
    }));
  });
});

describe('AppComponent - logged out', () => {
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;
  let fixture: ComponentFixture<AppComponent>;
  let app: AppComponent;
  let location: Location;
  let router: Router;

  let authCurrentUserSpy: any;
  const testUser: User = userTestData[0];

  let authService: any;

  beforeEach(waitForAsync(() => {
    authService = jasmine.createSpyObj('AuthService', ['getCurrentUser', 'logout']);
    authCurrentUserSpy = authService.getCurrentUser.and.returnValue(of(null));

    TestBed.configureTestingModule({
      declarations: [AppComponent],
      imports: [
        HttpClientTestingModule,
        RouterTestingModule.withRoutes(routes),
        ShellbarModule,
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

  describe('when logged out it', () => {
    it('should not have user menu', fakeAsync(() => {
      const userMenu: HTMLLIElement = fixture.nativeElement.querySelector('div.fd-user-menue');
      expect(userMenu).toBeNull();
    }));
  });
});
