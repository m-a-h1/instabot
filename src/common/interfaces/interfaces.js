module.exports = { 
    
    browser:{},
    page:{},
    base_URL: 'https://www.instagram.com',
    login_URL:'https://www.instagram.com/accounts/login/',
    TAG_URL: (tag) => `https://www.instagram.com/explore/tags/${tag}/`,
    Page_URL: (name) => `https://www.instagram.com/${name}`,
    used_pages: [],
    pageName: '_tohiid',
    following : {},         // list of following users and time period
    allHasFollowed:0,
    limit: 20,          // The maximum number that should be followed
    notFollowBusinessPage: false,        // If it should follow the buisness pages
    notFollowPrivatePage: true,        // If it should follow the private pages
    comments: [''],
    comment_text:"فروش انواع پرچم های مذهبی در ابعاد و طرح های دلخواه شما با بالاترین کیفیت چاپ و مناسب ترین قیمت بازار.\n\
    انواع محصولات فرهنگی\
    میتوانید مارا از طریق این صفحه دنبال کنید: @_tohiid\n\
    #پرچم #مذهبی #"
    
}
