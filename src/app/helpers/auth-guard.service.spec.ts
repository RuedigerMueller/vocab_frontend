import { Location } from '@angular/common';
import { HttpClientTestingModule, HttpTestingController, TestRequest } from '@angular/common/http/testing';
import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { first } from 'rxjs/operators';
import { userTestData } from 'test/user.testdata.spec';
import { routes } from '../app-routing.module';
import { User } from '../models/user.model';
import { backend, baseURL, frontend } from '../resource.identifiers';
import { AuthGuardService } from './auth-guard.service';
import { AuthService } from './auth.service';

describe('AuthGuardService', () => {
  let httpTestingController: HttpTestingController;
  let authGuardService: AuthGuardService;
  let authService: AuthService;
  let location: Location;
  const user_1: User = userTestData[0];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule.withRoutes(routes),
      ],
      providers: [
        AuthService
      ]
    });
    authGuardService = TestBed.inject(AuthGuardService);
    authService = TestBed.inject(AuthService);
    location = TestBed.inject(Location);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(authGuardService).toBeTruthy();
  });

  describe('canActivate', () => {
    it('should return true when a user is logged in', fakeAsync(() => {
      const route: ActivatedRouteSnapshot = new ActivatedRouteSnapshot();
      const mockSnapshot: any = jasmine.createSpyObj('RouterStateSnapshot', ['toString']);

      authService.login(user_1.email, user_1.password)
        .pipe(first())
        .subscribe();

      // Mock request to backend
      const req: TestRequest = httpTestingController.expectOne(`${baseURL}/${backend.login}`);
      expect(req.request.method).toBe('POST');
      req.flush({ username: user_1.email, password: user_1.password });
      httpTestingController.verify();

      tick();
      expect(authGuardService.canActivate(route, mockSnapshot)).toBeTrue();
    }));

    it('should return false when no user is logged in', () => {
      const route: ActivatedRouteSnapshot = new ActivatedRouteSnapshot();
      const mockSnapshot: RouterStateSnapshot = jasmine.createSpyObj<RouterStateSnapshot>('RouterStateSnapshot', ['toString']);
      authService.logout();
      expect(authGuardService.canActivate(route, mockSnapshot)).toBeFalse();
    });

    it('should navigate to login componente when no user is logged in', fakeAsync(() => {
      const route: ActivatedRouteSnapshot = new ActivatedRouteSnapshot();
      const mockSnapshot: any = jasmine.createSpyObj('RouterStateSnapshot', ['url']);
      mockSnapshot.url.and.returnValue('lessons');
      authService.logout();
      authGuardService.canActivate(route, mockSnapshot);
      tick();

      expect(location.path()).toBe(`/${frontend.login}`, 'should nav to login');
    }));
  });
});
