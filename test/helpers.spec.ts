import { HttpTestingController, TestRequest } from '@angular/common/http/testing';

export const requestCheck = async (httpTestingController: HttpTestingController, url: string, method: string, payLoad: any) => {
    const req: TestRequest = httpTestingController.expectOne(url);
    expect(req.request.method).toBe(method);
    expect(req.request.body).toBe(payLoad);

    req.flush(payLoad);
    httpTestingController.verify();
  };
