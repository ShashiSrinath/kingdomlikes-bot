const {kingdomlikes: selectors} = require('../selectors');
const selectButton = require('../util/selectButton');


module.exports = class FacebookPostLikes {
    noOfPostLikes = 0;

    constructor(browser, mainPage) {
        this.browser = browser;
        this.mainPage = mainPage;

        //navigating to fb likes page
        console.log("navigating to fb posts page");
        mainPage.goto("https://kingdomlikes.com/free_points/facebook-post-likes")
            .then(() => {
                this._setPopupWindowListner();
                console.log('Starting post like thread');
                this._likePosts();
            });
    }

    _setPopupWindowListner = () => {
        this.browser.on('targetcreated', async (target) => {
            const isPopupWindow = target._targetInfo.title.includes("m.facebook.com");
            if (isPopupWindow) {
                let popupPage = await target.page();

                popupPage.on('close', async () => {
                    this._likePosts();
                });

                try {
                    await popupPage.waitForSelector("[data-store*=reaction");
                    await popupPage.click("[data-store*=reaction");
                    this.noOfPostLikes++;
                } catch (e) {
                    console.log('unlikable post detected');
                }

                //close popup
                await new Promise(resolve => setTimeout(resolve, 3000));
                if (!popupPage.isClosed())
                    popupPage.close();
            }

        })
    };

    _likePosts = async () => {
        try {
            //waiting for the start button to show up
            await this.mainPage.waitForSelector(selectors.fbLikes.selectPageButton);

            const selectedButton = await selectButton(this.mainPage);

            //clicking the page view button
            await selectedButton.click();

        } catch (e) {
            if (e.message === 'waiting for selector "button.blue" failed: timeout 30000ms exceeded' || e.message === 'Cannot read property \'click\' of undefined'){
                console.log('Error detected: sleep the post like thread for 60 seconds')
                await new Promise(resolve => setTimeout(resolve, 60000));
                await this.mainPage.reload({ waitUntil: ["networkidle0", "domcontentloaded"] });
                console.log("Post Like thread started");
            }else {
                console.log(e.message)
            }

            this._likePosts();
        }

    };


};