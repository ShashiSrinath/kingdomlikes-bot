const fs = require('fs');
const path = require('path');
const FacebookLogin = require('./facebook/login');
const initializeBrowser = require('./initializeBrowser');

const lockFileDir = path.join(__dirname, '../.firstRunLock');


const checkFirstRun = () => {
    return fs.existsSync(lockFileDir);
};

module.exports = async () => {
    if (!checkFirstRun()) {
        let browser = await initializeBrowser();
        let page = await browser.newPage();
        let isLoginSuccess = await FacebookLogin.headlessLogin(page);

        if (!isLoginSuccess) {
            console.log("Auto Login Failed , Proceeding to Manual Login");
            await browser.close();
            browser = initializeBrowser(true);
            let page = await browser.newPage();
            page.setDefaultNavigationTimeout(90000);
            isLoginSuccess = await FacebookLogin.browserLogin(page);
        }

        if (isLoginSuccess) {
            console.log("Facebook Login Complete");
            await browser.close();
            fs.writeFileSync(lockFileDir, "true")
        }
    }
};



