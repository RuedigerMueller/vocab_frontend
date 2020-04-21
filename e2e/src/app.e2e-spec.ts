import { AppPage } from './app.po';
import { browser, logging } from 'protractor';

describe('Vocab TS', () => {
  let page: AppPage;

  beforeEach(() => {
    page = new AppPage();
  });

  it('should display Vocab TS', () => {
    page.navigateTo();
    expect(page.getTitleText()).toEqual('Vocab TS');
  });

  afterEach(async () => {
    // Assert that there are no errors emitted from the browser
    const logs = await browser.manage().logs().get(logging.Type.BROWSER);
    expect(logs).not.toContain(jasmine.objectContaining({
      level: logging.Level.SEVERE,
    } as logging.Entry));
  });
});
