const moment = require('moment');
const {kingdomlikes: selectors} = require('./selectors');

require('dotenv').config();
const checkFirstRun = require('./firstRun');
const initializeBrowser = require('./initializeBrowser');
const facebookPageLikes = require('./facebook/pageLikes');
const facebookPageFollows = require('./facebook/pageFollows');
const facebookPostLikes = require('./facebook/postLikes');

let browser;
let mainPage;


let currentPoints;

//opening the browser
const start = async () => {
    await checkFirstRun();

    try {
        browser = await initializeBrowser();
        mainPage = await browser.newPage();

        await logIntoKingdomLikes();

        const pageFollows = new facebookPageFollows(browser,mainPage);

        await new Promise(resolve => setTimeout(resolve, 20000));
        const postLikesPage = await browser.newPage();
        //facebookPageLikes(browser, pageLikesPage);
        const postLikes = new facebookPostLikes(browser,postLikesPage);



        //setup logger
        setInterval(async() => {
            const pointString = await postLikesPage.$eval(selectors.home.pointIndicator, element => element.innerHTML);
            currentPoints = parseInt(pointString);

            console.log(`${moment().format('YYYY-MM-DD HH:mm:ss')} :  Current Points:${currentPoints}   Post Likes:${postLikes.noOfPostLikes}   Page Follows:${pageFollows.noOfPageFollows}`);

        },20000);

    }catch (e) {
        console.log(e)
    }
};

const logIntoKingdomLikes = async () => {
    await mainPage.goto("https://kingdomlikes.com/");

    // logging into kingdom likes
    if (await mainPage.$(selectors.login.emailField) !== null) {
        console.log("Logging into kingdom likes");
        await mainPage.type(selectors.login.emailField, process.env.EMAIL);
        await mainPage.type(selectors.login.passwordField, process.env.PASSWORD);
        await mainPage.click(selectors.login.submitButton);

    }
    //waiting for the homepage to load
    await mainPage.waitForSelector(selectors.home.content);
};




start();