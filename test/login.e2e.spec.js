const playwright = require('playwright');
const chai = require('chai')
const expect = chai.expect
const credentials = require('../config').credentials
const selectors = require('../pageObject/loginPage').selectors
const loginUrl = require('../pageObject/loginPage').loginUrl

let page, browser, context

describe('Login page', () => {
  beforeEach(async function() {

    browser = await playwright.chromium.launch({
      headless: false,
      slowMo: 2000
    });
      
    context = await browser.newContext()
    page = await context.newPage(loginUrl)
  })

  afterEach(async function() {
    await page.screenshot({ path: `screenshots/${this.currentTest.title.replace(/\s+/g, '_')}.png` })
    await browser.close()
  })

  it('should exists', async() => {

    // Go to authentication form
    await page.goto(loginUrl);
    
    const title = await page.locator(selectors.h1Position).textContent();
    expect(title).to.equal('Complex Form Authentication')
  })

  it(`should not login, if selector option Don't Log Me In chosen`, async() => {

    await page.goto(loginUrl);
    await page.locator(selectors.login).fill(credentials.login);
    await page.locator(selectors.password).fill(credentials.password);

    // Select option "Don't Log Me In"
    await page.selectOption('[name="selectLogin"]', 'no');

    await page.click(selectors.loginCheckBox);
    await page.click(selectors.loginBtn);
    await page.waitForLoadState('networkidle');
    
    const title = await page.locator(selectors.h1Position).textContent();
    expect(title).to.equal('Login Failure')
  })

  it(`should not login, if checkbox do not selected`, async() => {

    await page.goto(loginUrl);
    await page.locator(selectors.login).fill(credentials.login);
    await page.locator(selectors.password).fill(credentials.password);
    await page.selectOption(selectors.loginSelect, 'yes');

    // Checkbox do not selected
    await page.click(selectors.loginBtn);
    await page.waitForLoadState('networkidle');
    
    const title = await page.locator(selectors.h1Position).textContent();
    expect(title).to.equal('Login Failure')
  })

  it(`should not login, if selector option Don't Log Me In chosen AND checkbox do not selected`, async() => {

    await page.goto(loginUrl);
    await page.locator(selectors.login).fill(credentials.login);
    await page.locator(selectors.password).fill(credentials.password);

    // Select option "Don't Log Me In"
    await page.selectOption(selectors.loginSelect, 'no');

    // Checkbox do not selected
    await page.click(selectors.loginBtn);
    await page.waitForLoadState('networkidle');
    
    const title = await page.locator(selectors.h1Position).textContent();
    expect(title).to.equal('Login Failure')
  })

  it('should successfully login and redirect to main page', async() => {

    await page.goto(loginUrl);
    await page.locator(selectors.login).fill(credentials.login);
    await page.locator(selectors.password).fill(credentials.password);
    await page.selectOption(selectors.loginSelect, 'yes');
    await page.click(selectors.loginCheckBox);
    await page.click(selectors.loginBtn);
    await page.waitForLoadState('networkidle');
    
    const title = await page.locator(selectors.h1Position).textContent();
    expect(title).to.equal('Login Success')
  })
})
