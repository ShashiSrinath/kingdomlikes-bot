const puppeteer = require("puppeteer");

module.exports = async (isNotHeadless) => {
    const isHeadless = isNotHeadless ? false : process.env.HEADLESS_MODE ? process.env.HEADLESS_MODE : true;
    return  await puppeteer.launch({
        headless: true,
        slowMo: 100,
        userDataDir: './BrowserData'
    });
};