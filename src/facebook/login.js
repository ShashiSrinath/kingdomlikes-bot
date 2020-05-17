const {facebook: selector} = require('../selectors');

const headlessLogin = async (page) => {
    await page.goto('https://wwww.facebook.com');
    await page.type(selector.emailField, process.env.FACEBOOK_EMAIL);
    await page.type(selector.passwordField, process.env.FACEBOOK_PASSWORD);
    await page.click(selector.loginButton);

    try {
        await page.waitForSelector(selector.loginSuccessIndicator);
        return true;
    }catch (e) {
            return false;
    }


};

const browserLogin = async (page) => {
    page.evaluate(() => {
        window.alert("Please log in to your facebook account");
    });
    await page.goto('https://wwww.facebook.com');
    try {
        await page.waitForSelector(selector.loginSuccessIndicator);
        return true;
    }catch (e) {
        return false;
    }
};

module.exports = {headlessLogin, browserLogin};