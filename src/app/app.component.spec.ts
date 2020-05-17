import { async, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ShellbarModule } from '@fundamental-ngx/core';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        ShellbarModule
      ],
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
});
