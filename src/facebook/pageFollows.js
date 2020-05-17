const {kingdomlikes: selectors} = require('../selectors');
const selectButton = require('../util/selectButton');

module.exports = class FacebookPageFollows {
    noOfPageFollows = 0;

    constructor(browser, mainPage) {
        this.browser = browser;
        this.mainPage = mainPage;


        //navigating to fb likes page
        console.log("navigating to fb page follow page");
        mainPage.goto("https://kingdomlikes.com/free_points/facebook-followers")
            .then(() => {
                this._setPopupWindowListner();
                console.log('Starting page follow thread');
                this._followPages();
            });
    }

    _setPopupWindowListner = () => {
        this.browser.on('targetcreated', async (target) => {
            const isPopupWindow = target._targetInfo.title.includes("www.facebook.com");
            if (isPopupWindow) {
                let popupPage = await target.page();

                popupPage.on('close', async () => {
                    this._followPages();
                });


                const followButton = await this._getFollowButton(popupPage);
                if (followButton) {
                    await followButton.click();
                    this.noOfPageFollows++;
                }

                //close popup
                await new Promise(resolve => setTimeout(resolve, 3000));
                if (!popupPage.isClosed())
                    popupPage.close();
            }

        })
    };

    _followPages = async () => {
        try {
            //waiting for the start button to show up
            await this.mainPage.waitForSelector(selectors.fbLikes.selectPageButton);

            const selectedButton = await selectButton(this.mainPage);

            //clicking the page view button
            await selectedButton.click();

        } catch (e) {
            if (e.message === 'waiting for selector "button.blue" failed: timeout 30000ms exceeded' || e.message === 'Cannot read property \'click\' of undefined'){
                console.log('Error detected: sleep the page follow thread for 60 seconds');
                await new Promise(resolve => setTimeout(resolve, 60000));
                await this.mainPage.reload({ waitUntil: ["networkidle0", "domcontentloaded"] });
                console.log("Page follow thread started");
            }else {
                console.log(e.message)
            }

            this._followPages();
        }

    };

    _getFollowButton = async (page) => {

        try {
            let chances = 0;

            let followButtons = await page.$x("//button[contains(text(), 'Follow')]");
            let followingButtons = await page.$x("//a/span[contains(text(), 'Following')]/..");


            if (followingButtons.length > 0) {
                await followingButtons[0].hover();
                let unfollowButtons = await page.$x("//span[contains(text(), 'Unfollow this Page')]");
                if (unfollowButtons.length) {
                    await unfollowButtons[0].click();
                    console.log('page unfollowed')
                }
            } else {
                return followButtons[0];
            }

        } catch (e) {
             console.log(e.message)
        }
    }
};