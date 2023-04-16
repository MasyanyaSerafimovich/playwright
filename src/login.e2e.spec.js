const playwright = require('playwright');
const chai = require('chai')
const expect = chai.expect

let page, browser, context

const selectors = {
  login: 'input[name=email]',
  password: 'input[name=password]',
  loginSelect: '[name=selectLogin]',
  loginCheckBox: '[name=loveForm]',
  loginBtn: '[type=submit]',
  loginSuccess: '.container h1'
}

const credentials = {
  login: 'complex@authenticationtest.com',
  password: 'pa$$w0rd'
}

describe('Login page', () => {
  beforeEach(async function() {
    browser = await playwright.chromium.launch({
      headless: false,
      slowMo: 2000
    });
      
    context = await browser.newContext()
    page = await context.newPage('https://authenticationtest.com/complexAuth/')
  })

  afterEach(async function() {
    await page.screenshot({ path: `screenshots/${this.currentTest.title.replace(/\s+/g, '_')}.png` })
    await browser.close()
  })

  it('should exists', async() => {
    await page.goto('https://authenticationtest.com/complexAuth/');
    
    const title = await page.title()
    expect(title).to.equal('Authentication Test')
  })

  it(`should not login, if selector said Don't Log Me In`, async() => {
    await page.goto('https://authenticationtest.com/complexAuth/');

    await page.locator(selectors.login).fill(credentials.login);
    await page.locator(selectors.password).fill(credentials.password);

    await page.click(selectors.loginCheckBox);
    await page.click(selectors.loginBtn);

    await page.waitForLoadState('networkidle');
    
    const title = await page.locator(selectors.loginSuccess).textContent();

    expect(title).to.equal('Login Failure')
  })

  it('should successfully login and redirect to main page', async() => {
    await page.goto('https://authenticationtest.com/complexAuth/');

    await page.locator(selectors.login).fill(credentials.login);
    await page.locator(selectors.password).fill(credentials.password);

    await page.click(selectors.loginSelect)
    await page.locator('[value=yes]').click();

    await page.click(selectors.loginCheckBox);
    await page.click(selectors.loginBtn);

    await page.waitForLoadState('networkidle');
    
    const title = await page.locator(selectors.loginSuccess).textContent();

    expect(title).to.equal('Login Success')
  })
})
