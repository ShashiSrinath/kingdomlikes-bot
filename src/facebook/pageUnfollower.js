const pageUnfollower = async (browser, url) => {
    await new Promise(resolve => setTimeout(resolve, 2000));
    const page = await browser.newPage();
    await page.goto(url);

    let followButtons = await page.$x("//a/span[contains(text(), 'Following')]/..");
    console.log(followButtons.length)
    if (followButtons.length > 0) {
        await followButtons[0].hover();

        await new Promise(resolve => setTimeout(resolve, 1000));
        let unfollowButtons = await page.$x("//span[contains(text(), 'Unfollow this Page')]");
        if (unfollowButtons.length)
            await unfollowButtons[0].click()
    }
};

module.exports = pageUnfollower;