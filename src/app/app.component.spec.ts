import { TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { FundamentalNgxCoreModule } from '@fundamental-ngx/core';

describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        FundamentalNgxCoreModule
      ],
      declarations: [
        AppComponent
      ],
    }).compileComponents();
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

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
