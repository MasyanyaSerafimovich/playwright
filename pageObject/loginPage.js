const loginUrl = 'https://authenticationtest.com/complexAuth/'

const selectors = {
    login: 'input[name=email]',
    password: 'input[name=password]',
    loginCheckBox: '[name=loveForm]',
    loginBtn: '[type=submit]',
    h1Position: '.container h1',
    loginSelect: '[name="selectLogin"]'
}

module.exports.selectors = selectors
module.exports.loginUrl = loginUrl