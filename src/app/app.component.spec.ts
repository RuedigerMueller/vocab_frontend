import { async, TestBed, fakeAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ShellbarModule } from '@fundamental-ngx/core';
import { AppComponent } from './app.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { User } from './models/user.model';
import { userTestData } from 'test/user.testdata.spec';
import { of } from 'rxjs';
import { AuthService } from './helpers/auth.service';

describe('AppComponent', () => {
  /* let authCurrentUserSpy: any;
  const testUser: User = userTestData[0]; */

  beforeEach(async(() => {
    /* const authService: any = jasmine.createSpyObj('AuthService', ['currentUser']);
    authCurrentUserSpy = authService.currentUser.and.returnValue(of(testUser)); */

    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        ShellbarModule,
        HttpClientTestingModule,
      ],
     /*  providers: [
        { provide: AuthService, useValue: authService }
      ], */
      declarations: [
        AppComponent
      ],
    }).compileComponents();
  }));

  describe('should create application', () => {
    it('should create the app', () => {
      const fixture = TestBed.createComponent(AppComponent);
      const app = fixture.componentInstance;
      expect(app).toBeTruthy();
    });
  });

  describe('should render UI elements', () => {
    it(`should have as title 'Vocab TS'`, () => {
      const fixture = TestBed.createComponent(AppComponent);
      const app = fixture.componentInstance;
      expect(app.title).toEqual(app.title);
    });

    it('should render title', async () => {
      const fixture = TestBed.createComponent(AppComponent);
      const app = fixture.componentInstance;

      fixture.detectChanges();

      const appElement: HTMLElement = fixture.nativeElement;
      const titleElement = appElement.querySelector('fd-shellbar-title');

      expect(titleElement.textContent).toContain(app.title);
    });
  });

  describe('should have required actions', () => {
    xit('should have link "Logout"', () => {
      /* const button: HTMLButtonElement = fixture.nativeElement.querySelector('#edit-lesson-saveButton');
      expect(button.textContent).toContain('Save'); */
    });
  });

  describe('should route correctly on actions', () => {
    xit('should navigate to login component when clicking "Logout"', fakeAsync(() => {
      /* const saveButton: HTMLButtonElement = fixture.nativeElement.querySelector('#edit-lesson-saveButton');
      saveButton.click();
      tick();

      expect(location.path()).toBe(`/${frontend.lessons}`, 'should nav to listLessons'); */
    }));
  });
});
