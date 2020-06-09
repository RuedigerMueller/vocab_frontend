import { Location } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed, tick, fakeAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { userTestData } from 'test/user.testdata.spec';
import { routes } from '../app-routing.module';
import { User } from '../models/user.model';
import { AuthGuardService } from './auth-guard.service';
import { AuthService } from './auth.service';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { frontend } from '../resource.identifiers';
import { first } from 'rxjs/operators';

describe('AuthGuardService', () => {
  let authGuardService: AuthGuardService;
  let authService: AuthService;
  let location: Location;
  const user_1: User = userTestData[0];
  /* let authServiceSpy: any;
  const authService: any = jasmine.createSpyObj('AuthService', ['currentUserValue']);
  authServiceSpy = authService.currentUserValue.and.returnValue(user_1);
 */
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule.withRoutes(routes),
      ],
      /* providers: [
        { provide: AuthService, useValue: authService },
      ] */
      providers: [
        AuthService
      ]
    });
    authGuardService = TestBed.inject(AuthGuardService);
    authService = TestBed.inject(AuthService);
    location = TestBed.inject(Location);
  });

  it('should be created', () => {
    expect(authGuardService).toBeTruthy();
  });

  xdescribe('canActivate', () => {
    xit('should return true when a user is logged in', fakeAsync(() => {
      const route: ActivatedRouteSnapshot = new ActivatedRouteSnapshot();
      const mockSnapshot: any = jasmine.createSpyObj('RouterStateSnapshot', ['toString']);
      authService.login(user_1.email, user_1.password)
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
      expect(authGuardService.canActivate(route, mockSnapshot)).toBeTrue();
    }));

    xit('should return false when no user is logged in', () => {
      // authServiceSpy.and.returnValue(null);
      const route: ActivatedRouteSnapshot = new ActivatedRouteSnapshot();
      const mockSnapshot: RouterStateSnapshot = jasmine.createSpyObj<RouterStateSnapshot>('RouterStateSnapshot', ['toString']);
      authService.logout();
      expect(authGuardService.canActivate(route, mockSnapshot)).toBeFalse();
    });

    xit('should navigate to login componente when no user is logged in', () => {
      // authServiceSpy.and.returnValue(null);
      const route: ActivatedRouteSnapshot = new ActivatedRouteSnapshot();
      const mockSnapshot: any = jasmine.createSpyObj('RouterStateSnapshot', ['url']);
      mockSnapshot.url.and.returnValue('lessons');

      authGuardService.canActivate(route, mockSnapshot);

      expect(location.path()).toBe(`/${frontend.login}`, 'should nav to listLessons');
    });
  });
});
