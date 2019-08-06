module.exports = { 
    
    browser:{},
    page:{},
    login_URL:'https://www.instagram.com/accounts/login/',
    TAG_URL: (tag) => `https://www.instagram.com/explore/tags/${tag}/`,
    used_pages: [],
    pageName: '_tohiid',
    following : {},         // list of following users and time period
    allHasFollowed:0
}
