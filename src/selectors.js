module.exports = {
    facebook: {
        emailField: '#email',
        passwordField: '#pass',
        loginButton: '#u_0_b',
        loginSuccessIndicator: '#sideNav'
    },
    kingdomlikes: {
        login: {
            emailField: "#formlogin > .row > input[type=\"email\"]",
            passwordField: "#formlogin > .row > input[type=\"password\"]",
            submitButton: "#formlogin > .row > input[type=\"submit\"]"
        },
        home: {
            content: "#principalcontent",
            pointIndicator: '#points'
        },

        fbLikes: {
            selectPageButton: "button.blue",
            //likeConfirmButton: "#u_0_0 > div > div.uiInterstitialBar.uiBoxGray.topborder > div > div.rfloat._ohf > button:nth-child(1)"
            likeConfirmButton: "button[name=__CONFIRM__"
        }
    },

};

