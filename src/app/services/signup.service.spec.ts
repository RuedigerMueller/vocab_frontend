import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { requestCheck } from 'test/helpers.spec';
import { userTestData } from 'test/user.testdata.spec';
import { backend, baseURL } from '../resource.identifiers';

import { SignupService } from './signup.service';

describe('SignupService', () => {
  let signUpService: SignupService;
  let httpTestingController: HttpTestingController;

  const backendURL: string = baseURL;
  const usersURI: string = backend.users;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
      ],
    });
    signUpService = TestBed.inject(SignupService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(signUpService).toBeTruthy();
  });

  it('should POST user data to backend sign-up service', () => {
    signUpService.signup(userTestData[0]).subscribe();

    const expectedURL: string =  backendURL + '/' + usersURI;
    const expectedMethod = 'POST';
    const expectedPayload: string = JSON.stringify(userTestData[0]);
    requestCheck(httpTestingController, expectedURL, expectedMethod, expectedPayload);
  });

  it('should GET information if an e-Mail address is taken from backend service', () => {
    signUpService.checkEMailTaken(userTestData[0].email).subscribe();

    const expectedURL: string =  backendURL + '/' + usersURI + '?email=' + userTestData[0].email;
    const expectedMethod = 'GET';
    const expectedPayload = null;
    requestCheck(httpTestingController, expectedURL, expectedMethod, expectedPayload);
  });
});
