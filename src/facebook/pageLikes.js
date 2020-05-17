const {kingdomlikes:  selectors} = require('../selectors');
const selectButton = require('../util/selectButton');

module.exports =  (browser, mainPage) => {
   new FacebookPageLikes(browser, mainPage);
};

class FacebookPageLikes {
    constructor(browser, mainPage) {
        this.browser = browser;
        this.mainPage = mainPage;


        //navigating to fb likes page
        console.log("navigating to fb likes page");
        mainPage.goto("https://kingdomlikes.com/free_points/facebook-likes")
            .then(() => {
                this._setPopupWindowListner();
                this._likePages();
            });
    }

    _setPopupWindowListner = () => {
        this.browser.on('targetcreated', async (target) => {
            const isPopupWindow = target._targetInfo.title.includes("facebook.com/plugins/like?")
                || target._targetInfo.title.includes("kingdomsubs.com/getlink.php?");

            if (isPopupWindow) {
                let popupPage = await target.page();

                popupPage.on('close', async () => {
                    this._likePages();
                });

                await popupPage.waitForSelector("button");
                const popupBrowser = await target.browser();

                popupBrowser.on('targetcreated', async (target) => {
                    const confirmationPage = await target.page();
                    await confirmationPage.waitForSelector(selectors.fbLikes.likeConfirmButton);
                    await confirmationPage.click(selectors.fbLikes.likeConfirmButton);
                });

                await popupPage.click("button");

            }

        })
    };

    _likePages = async () => {
        try {
            //waiting for the start button to show up
            await this.mainPage.waitForSelector(selectors.fbLikes.selectPageButton);

            const selectedButton = await selectButton(this.mainPage);

            //clicking the page view button
            await selectedButton.click();

        } catch (e) {
            console.log(e);
        }

    };


}