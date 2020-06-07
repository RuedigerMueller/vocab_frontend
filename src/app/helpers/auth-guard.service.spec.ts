import { Location } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { userTestData } from 'test/user.testdata.spec';
import { routes } from '../app-routing.module';
import { User } from '../models/user.model';
import { AuthGuardService } from './auth-guard.service';
import { AuthService } from './auth.service';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { frontend } from '../resource.identifiers';

describe('AuthGuardService', () => {
  let authGuardService: AuthGuardService;
  let location: Location;
  const user_1: User = userTestData[0];
  let authServiceSpy: any;
  const authService: any = jasmine.createSpyObj('AuthService', ['currentUserValue']);
  authServiceSpy = authService.currentUserValue.and.returnValue(of(user_1));

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule.withRoutes(routes),
      ],
      providers: [
        { provide: AuthService, useValue: authService },
      ]
    });
    authGuardService = TestBed.inject(AuthGuardService);
    location = TestBed.inject(Location);
  });

  it('should be created', () => {
    expect(authGuardService).toBeTruthy();
  });

  describe('canActivate', () => {
    it('should return true when a user is logged in', () => {
      const route: ActivatedRouteSnapshot = new ActivatedRouteSnapshot();
      const mockSnapshot: any = jasmine.createSpyObj('RouterStateSnapshot', ['toString']);
      expect(authGuardService.canActivate(route, mockSnapshot)).toBeTrue();
    });

    xit('should return false when no user is logged in', () => {
      authServiceSpy.and.returnValue(null);
      const route: ActivatedRouteSnapshot = new ActivatedRouteSnapshot();
      const mockSnapshot: RouterStateSnapshot = jasmine.createSpyObj<RouterStateSnapshot>('RouterStateSnapshot', ['toString']);
      expect(authGuardService.canActivate(route, mockSnapshot)).toBeFalse();

    });

    xit('should navigate to login componente when no user is logged in', () => {
      authServiceSpy.and.returnValue(null);
      const route: ActivatedRouteSnapshot = new ActivatedRouteSnapshot();
      const mockSnapshot: any = jasmine.createSpyObj('RouterStateSnapshot', ['url']);
      mockSnapshot.url.and.returnValue('lessons');

      authGuardService.canActivate(route, mockSnapshot);

      expect(location.path()).toBe(`/${frontend.login}`, 'should nav to listLessons');
    });
  });
});
