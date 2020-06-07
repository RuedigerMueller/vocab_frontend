import { HttpClientTestingModule, HttpTestingController, TestRequest } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { baseURL, backend } from '../resource.identifiers';
import { userTestData } from 'test/user.testdata.spec';
import { User } from '../models/user.model';

describe('AuthService', () => {
  let authService: AuthService;
  let httpTestingController: HttpTestingController;
  const backendURL: string = baseURL;
  const loginURI: string = backend.login;
  const testUser: User = userTestData[0];

  const requestCheck = async (url: string, method: string, testData: any) => {
    const req: TestRequest = httpTestingController.expectOne(url);
    expect(req.request.method).toBe(method);

    req.flush(testData);
    httpTestingController.verify();
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
      ],
    });
    authService = TestBed.inject(AuthService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(authService).toBeTruthy();
  });

  describe('login', () => {
    it('should login the user', async () => {
      authService.login(testUser.email, testUser.password).subscribe((user: User) => {
        expect(user).toBeDefined();
      });

      requestCheck(backendURL + '/' + loginURI, 'POST', {username: testUser.email, password: testUser.password});
    });
  });

  describe('logout', () => {
    it('should logout the user', () => {
      authService.logout();
      expect(authService.currentUserValue).toBeNull();
    });
  });
});
