import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginComponent } from './login.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { routes } from '../app-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoginComponent ],
      imports: [
        HttpClientTestingModule,
        RouterTestingModule.withRoutes(routes),
        ReactiveFormsModule,
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('should be unit testes', () => {
    xit('should be unit tested', () => {

    });
  });

  describe('should support keyboard navigation', () => {
    it('lesson user e-Mail should have autofocus', () => {
      const inputDE: DebugElement = fixture.debugElement.query(By.css('#login-userEmail'));
      const inputElement: HTMLInputElement = inputDE.nativeElement;
      expect (inputElement.autofocus).toBeTrue();
    });
  });
});
