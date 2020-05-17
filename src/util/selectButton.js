const selectButton = async (page) => {
    if (!page) {
        throw new Error("You need to pass a puppeteer page for this function")
    }

    await _waitForMask(page);

    const likeButtons = await page.$$('[id*=page] > div > div.containerbtn.remove > button');
    const pointStrings = await page.$$eval('[id*=idpage] > div > div.containertitle.remove > h5 > span',
        elements => elements.map(e => e.innerHTML));

    if (likeButtons.length !== pointStrings.length)
        return await selectButton();
    else {
        let highestPointCount = 0;
        let highestPointIndex = 0;
        pointStrings.forEach((pointString, index) => {
            let points = parseInt(pointString);
            if (points > highestPointCount) {
                highestPointCount = points;
                highestPointIndex = index;
            }
        });
        return likeButtons[highestPointIndex];
    }
};

const _waitForMask = async (page) => {
    const hasNoMask = await page.$$eval('div.mask.zindex.skyblue',
        (elements) => {
            let hasNoMask = true;
            elements.forEach(element => {
                let style = window.getComputedStyle(element);
                if (style.display !== 'none')
                   hasNoMask = false;
            });

            return hasNoMask;
        });

    if (hasNoMask)
        return true;
    else {
        await new Promise(resolve => setTimeout(resolve, 2000));
        return await _waitForMask(page);
    }
};

module.exports = selectButton;