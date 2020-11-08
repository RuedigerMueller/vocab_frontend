import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MessageStripModule } from '@fundamental-ngx/core';
import { PageNotFoundComponent } from './page-not-found.component';


describe('PageNotFoundComponent', () => {
  let component: PageNotFoundComponent;
  let fixture: ComponentFixture<PageNotFoundComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PageNotFoundComponent ],
      imports: [
        MessageStripModule
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PageNotFoundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('should render UI elements', () => {
    it('should display "Page not found"', () => {
      const paragraph: HTMLParagraphElement = fixture.nativeElement.querySelector('p.fd-message-strip__text');
      expect(paragraph.innerHTML).toContain('Page not found');
    });
  });
});
