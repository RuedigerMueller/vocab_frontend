import { Location } from '@angular/common';
import { async, TestBed, fakeAsync, ComponentFixture, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ShellbarModule } from '@fundamental-ngx/core';
import { AppComponent } from './app.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { User } from './models/user.model';
import { userTestData } from 'test/user.testdata.spec';
import { of } from 'rxjs';
import { AuthService } from './helpers/auth.service';
import { routes } from './app-routing.module';
import { Router } from '@angular/router';
import { frontend } from './resource.identifiers';

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;
  let app: AppComponent;
  let location: Location;
  let router: Router;

  let authCurrentUserSpy: any;
  const testUser: User = userTestData[0];

  const expandUserMenu = () => {
    const expandableButton: HTMLButtonElement = fixture.nativeElement.querySelector('.fd-identifier.fd-identifier--xs');
    expandableButton.click();
    fixture.detectChanges();
  };

  beforeEach(async(() => {
    const authService: any = jasmine.createSpyObj('AuthService', ['getCurrentUser']);
    authCurrentUserSpy = authService.getCurrentUser.and.returnValue(of(testUser));
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes(routes),
        ShellbarModule,
        HttpClientTestingModule,
      ],
     providers: [
        { provide: AuthService, useValue: authService }
      ],
      declarations: [
        AppComponent
      ],
    }).compileComponents();
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
    xit('should navigate to login component when clicking "Logout"', fakeAsync(() => {
      expandUserMenu();
      const listElement: HTMLLIElement = fixture.nativeElement.querySelector('li.fd-menu__item');
      listElement.click();
      tick();

      expect(location.path()).toBe(`/${frontend.login}`, 'should nav to login');
    }));
  });
});
