const puppeteer = require('puppeteer');
const iPhone = puppeteer.devices['iPhone 6']

const methods = require('./methods');


const BASE_URL = 'http://instagram.com/';
const TAG_URL = (tag) => `https://www.instagram.com/explore/tags/${tag}/`;
const LOC_URL = (LOc) => ``;
const ActivityUrl = "https://www.instagram.com/accounts/activity/"
var pageName = '_b_a_d_ass_0'
var notFollowBusinessPage
var notFollowPrivatePage = true
var currentURL;
var unfollowPeriod = 15;
var likeLastPost = true


var usedPages = [];
var lastInFeed = null;

const instagram = {
    browser: null,
    page: null,
    page2: null,

    Following: {  
        "username": "date"
    },

    initialize: {

        start: async() => {

            console.log('init started')
            return await instagram.initialize.lunch()
            .then((res) => {console.log('response came.'); return res})
            .catch((err) => {console.log('error came.'); throw err})
        },

        lunch: async () =>{

            console.log('lunch started')
            await puppeteer.launch({
                headless: false,
                executablePath: './chrome-win/chrome.exe'
                
            })
            .then((resolve) => { instagram.browser = resolve})
            .catch((err) => {throw new _error(11 ,'lunch', err, 'redo')});
            return await instagram.initialize.newPage()
        },
        
        newPage: async () => {

            console.log('newpage started')
            instagram.page = await instagram.browser.newPage()
            .catch(() => {throw new _error(12, 'init,newpage', 'error: lunch problem', 'redo')})
            await instagram.page.emulate(iPhone);
            await instagram.page.waitFor(1000);
            return 'all is good in initializing'
        }
    },
    login: {
        username:null,
        password:null,
        finish:false,

        start: async(reload,username, password) => {
            console.log('login process start')

            if(username != '' & password != ''){
                instagram.login.username = username
                instagram.login.password = password
            }

            return await instagram.login.load()
            .then((res) => {console.log('response came.'); return res})
            .catch((err) => {console.log('error came.'); throw err})
            
        },
        
        // It will laod the insta page
        load: async () => {
            console.log('load start')
            
            let isLoaded = false;
            var _try = 0
            
            while(!isLoaded){
    ``
                _try++;
    
                // Goto the url
                await instagram.goto_page(BASE_URL,'//button[contains(text(), "Log In")]')
                .then(() => isLoaded = true)
                .catch(async(err) => {
                    // If we already inter the profile
                    await instagram.login.check()
                    .then(() => {instagram.login.finish = true})
                    .catch(() => {
    
                        console.log(err)
                        if(_try > 9)
                            throw new _error(21 ,'load', 'faild to enter to url', '')
                    }) 
                })
    
                if(instagram.login.finish)
                    return 'we are already loged in'
                
                // Reset the page after 3 failed try
                if(!isLoaded && _try % 3 === 0){
                    await instagram.page.close();
                    await instagram.page.waitFor(1000)
                    instagram.page = await instagram.browser.newPage()
                    .catch(() => {throw new _error(22,'load', 'there is an problem in makeing new page', 'redo')})
                    await instagram.page.emulate(iPhone);
                    await instagram.page.waitFor(1000)
                }
            }

            return await instagram.login.goto();
        },

        // it redirect to the login page
        goto: async(reload = false) => {
            console.log('goto start')

            await instagram.login.check()
            .then(() => {instagram.login.finish = true})
            .catch((err) => {console.log(err)})

            if(instagram.login.finish)
                return 'we already are loged in'

            if(reload)
                await instagram.page.reload()
                .then(console.log('reload has done successfuly in goto'))
                .catch((err) => {throw new _error(23,'load',err,'redo')})

            // Go to the login page
           await instagram.click('//button[contains(text(), "Log In")]', '//button[contains(., "Log In")]')
           .then()
           .catch((err) => {throw new _error(24, 'goto', err, 'redo')})

           return instagram.login.login()
        },

        // it will login to instagram by username and password
        login: async (reload = false) => {
            console.log('login start')

            await instagram.login.check()
            .then(() =>{instagram.login.finish = true})
            .catch((err) => {console.log(err)})

            if(instagram.login.finish)
                return 'we already are loged in'

            if(reload)
                await instagram.page.reload()
                .then(console.log('reload has done successfuly in login'))
                .catch((err) => {throw new _error(25,'load',err,'redo')})

            console.log('turn to enter the text')
            await instagram.page.waitFor(2000)
            /* writeing the username and password */
            await instagram.page.type('input[name="username"]', instagram.login.username, {delay: 50});
            await instagram.page.type('input[name="password"]', instagram.login.password, {delay: 50});
    
            console.log('typing is done')
    
            //click on login button
            await instagram.click('//button[contains(., "Log In")]','',30000)
            .catch(async (err) => {
                await instagram.login.error()
                throw new _error(26,'login',err, 'redo')
            })


            return instagram.login.popup()
        },

        // This will check if there is a problem in login process or not
        error: async () => {
            console.log('error start')

            // If there was an error in login information
            var problem = await instagram.page.$('p[role="alert"]')
    
            if(problem){
                var alert
                var el = instagram.page.$('p[role="alert"]');
                instagram.page.evaluate(el => alert = el.textContent, el)            // #Modify  alert dose not get the right content
                console.log('there is an problem in log in', alert);
                throw new _error(27, 'login', alert, 'reject')                       // #Modify  should try 3 time
            }
    
            
        },
        
        // It will run in order to close some popup windows
        popup: async () => {
            console.log('popup start')

            await instagram.page.waitFor(2000)
                // Pass i don`t no what 
                await instagram.page.waitFor('//button[contains(., "Cancel")]');
    
                await instagram.click('//button[contains(., "Cancel")]','',5000)
                .catch((err) => {console.log('error', err)})    

                return instagram.login.check()
        },

        // It will check if the we login properly
        check: async () => {
            console.log('check start')

            let loginID = await instagram.page.evaluate(() => {return window._sharedData.config.viewerId})
            if(loginID){
                console.log('we are loged in')
                await instagram.page.waitFor('a > span[aria-label="Profile"]')
                .catch(console.log('pattern didnt appear at loading profile'))
                await instagram.page.waitFor(2000);
                return 'all done in login'
            }
            console.log('are not loged in')
            throw 'fuck'
    
        }
    },

    likeTagsProcess: {
        tags:[],
        finish_tags:[],
        current_tag:'',
        start: async(tags = []) => {
            console.log('like process start')
            // initiate some variable
            instagram.likeTagsProcess.tags = tags
            instagram.likeTagsProcess.finish_tags = []

            return await instagram.likeTagsProcess.main()
            .then((res) => {console.log('response came.'); return res})
            .catch((err) => {console.log('error came.'); throw err})
        },

        main: async () => {
            console.log('main start')
            console.log('finish tags:', instagram.likeTagsProcess.finish_tags)
            console.log('current tag before: ',instagram.likeTagsProcess.current_tag)

            var error = {}
            for(let tag of instagram.likeTagsProcess.tags) {

                var next = false
                // Check if the tag has been used
                for(let finishTag of instagram.likeTagsProcess.finish_tags){
                    console.log('/* tag  vs  finish tag')
                    console.log(tag, ' vs ', finishTag)
                    if(tag === finishTag)
                        next = true
                }
                if(next)
                    continue
                
                // Add current tag to current_tag
                instagram.likeTagsProcess.current_tag = tag
                console.log('current tag after: ',instagram.likeTagsProcess.current_tag)

                await instagram.likeTagsProcess.load()
                .then(() => {
                    console.log(`tag: ${instagram.likeTagsProcess.current_tag} is done`)
                    console.log('fuck you')
                    instagram.likeTagsProcess.finish_tags.push(instagram.likeTagsProcess.current_tag)
                    console.log('dont you fucking see me!!!')
                    console.log('finish tags:', instagram.likeTagsProcess.finish_tags)
                })
                .catch((err) => {error = err})

                if(!methods.isEmpty(error)){
                    console.log('***** error: ', error)
                    throw error
                }
                // Delay beforload other tag
                await instagram.page.waitFor(4000);
            }
            return 'likeTagProcess has ended perfectly'
        },

        load: async() => {
            console.log('load start')
                
            console.log('current tag: ',instagram.likeTagsProcess.current_tag)
            // Go to the tag page
            await instagram.goto_page(TAG_URL(instagram.likeTagsProcess.current_tag))
            .catch((err) => {throw new _error(31,'main',err,'redo')})


            return await instagram.likeTagsProcess.like()
            
        },

        like: async () => {
            console.log('like start')

            for(let i = 0 ; i < 3; i++) {
                
                let posts = await instagram.page.$$('article > div:nth-child(3) img[decoding="auto"]')
                .catch((err) => {throw new _error(32, 'main', err, 'redo')})
                let post = posts[i];

                // Like and comment         NO NEED FOR CATCHING ERROR
                await instagram.likeAndComment(post)
                .catch((err) => {
                    throw err
                })
    
                await instagram.page.waitFor(2000);
    
                // Back to the first place
    
                await instagram.page.click('span[aria-label="Back"]')
                await instagram.page.waitFor(1000);
                await instagram.page.click('span[aria-label="Back"]')
                await instagram.page.waitFor(1000)
            }
            return 'like is done'
        }  
    },

    followProcess: {

        followed : 0,   // To check how many followed in one round
        round : 0,       // To check from where it should start
        AllFollowed,
        title,          // page,s name - check not being repetitive
        button,
        text : null,
        limit : 20,
        end : 0,

        start: (tags = [], location = [], users = []) => {
            console.log('follow process startd.')

        },

        // Getting tags
        for(let tag of tags) {

            var used = false;

            // Go to tag page
            await instagram.goto_page(TAG_URL(tag), 'article > div:nth-child(1) img[decoding="auto"]')
            .catch((err) => {throw new _error(41, 'followProcess//load page',err, 'redo')})

            // Getting first top post of the tag 
            let posts = await instagram.page.$$('article > div:nth-child(1) img[decoding="auto"]');
            let post
            for(let i = 0; i <= posts.length; i++){

                posts = await instagram.page.$$('article > div:nth-child(1) img[decoding="auto"]');
                post = posts[i];
                console.log('typeof: ',typeof post)

                // Click on the post
                do{

                    var load = false;

                    await instagram.click(post, 'header > div:nth-child(2) a:nth-child(1)', 5000)
                    .then(()=> load = true)
                    .catch((err) => {throw new _error(42,'follow//clickOnPost', err, 'redo')})
                }while(!load)

                await instagram.page.waitFor(1000);

                // Check if page was already used
                title = instagram.page.$('header > div:nth-child(2) a:nth-child(1)');
                title = instagram.page.evaluate(title => title.textContent,title);
                
                used = methods.check(title, usedPages)
                if(!used)
                    break;
                await instagram.page.click('span[aria-label="Back"]')
                await instagram.page.waitFor(1000);
            }

            if(!used)
                break;
        }

        // Click on page link
        await instagram.click('header > div:nth-child(2) a:nth-child(1)', 'ul > li:nth-child(2) > a',10000)
        .then()
        .catch((err) => {throw new _error(43, 'follow//openPost', err, 'redo')})
        await instagram.page.waitFor(2000);

        currentURL = await instagram.page.url();
        console.log('current url',currentURL) 


        // Click on the followers link
        await instagram.click('//a[contains(., "followers")]','img',10000)
        .catch((err) => {throw new _error(44, 'follow//clickOnFollowersButton', err, 'redo')})
        await instagram.page.waitFor(2000);

        var elementscroll = await instagram.page.$('main');
        console.log('elementscroll--------------',elementscroll)

        // Follow people
        while(followed < limit) {

            console.log('its here.')
            // Need to review #review
            
            var followButtons = await instagram.page.$$('button');
           
            for(let i= round; i<followButtons.length; i++){
                
                console.log('i,followed, round');
                console.log(i,' _ ', followed, ' _ ', round);

                followButtons = await instagram.page.$$('button');
                var linkPage = await instagram.page.$$('a[title]')
                button = followButtons[i];
                
                text = await instagram.page.evaluate(button => button.textContent, button);
                var pageName = await instagram.page.evaluate((element) => element.textContent,linkPage[i]);
                
                console.log(text);
                if(text == "Follow") {

                    console.log('****', typeof linkPage[i])
                    let isFollowd = await instagram.subFollow(linkPage[i],notFollowBusinessPage,notFollowPrivatePage);   // need to modify
                    if(isFollowd) {
                        followed++;
                        instagram.Following[pageName] = new Date().getTime();
                        console.log(instagram.Following)
                        if(likeLastPost){

                            let hasPost = !await instagram.page.evaluate(() => {return window._sharedData.entry_data.ProfilePage[0].graphql.user.is_private})
                            if (hasPost){

                                hasPost = await instagram.page.$('li span span')
                                hasPost = await instagram.page.evaluate(element => element.textContent, hasPost)
                                if(hasPost != "0"){

                                    let link = await instagram.page.$('article div a')
                                    await instagram.likeAndComment(link)
                                }
                            }
                        }
                    }
                    console.log(followed)
                    
                    // Back to the first square
                    await instagram.goto_page(currentURL, 'ul > li:nth-child(2) > a')
                    .catch((err) =>{throw new _error(45, 'follow//got to base page', err, 'redo')})
                    await instagram.page.waitFor(2000);
                    
                    // Click on thefollowers button
                    await instagram.click('//a[contains(., "followers")]', 'img',10000)
                    .catch((err) =>{throw new _error(46, 'follow//click on followers link', err, 'redo')})
                    await instagram.page.waitFor(2000);

                    var elementscroll = await instagram.page.$('main');
                    console.log('elementscroll--------------',elementscroll)
                        
                    
                    await instagram.page.waitFor(2000);
                    if(followed >= limit){
                        
                        end = 1;
                        break;
                    }
                }
                round++;
            }
            if(end)
                break
            
            await instagram.page.evaluate( elementscroll => elementscroll.scrollBy(0,500), elementscroll);

        }
        AllFollowed+=followed;
        await instagram.page.waitFor(2000);
    },
    unfollowProcess: async () => {
        console.log('unfollow process startd.')

        var round = 0;
        var text;
        var unfollowed = 0;
        var f_name_list;
        var f_name;
        var followersButtons;
        var perDelete = {user:true, time:false}
        var save = false;       // #Modify to turn to boolean.
        var limit = 20;
        var saveList = [
            'human_david',
            'pariaakhavass',
            'developers_team'
        ]       // #Modify  to make a seperate file for it.

        // Goto profile
        await instagram.goto_page(`https://www.instagram.com/${pageName}/`, `a[href="/${pageName}/followers/"]`, 20000)
        .catch((err) => {throw new _error(51, 'unfollow//gotoProfile', err, 'redo')})
        await instagram.page.waitFor(2000)
        
        // Click on followers button
        await instagram.click(`a[href="/${pageName}/following/"]`, 'img', 5000)
        .catch((err) => {throw new _error(52, 'unfollow//clickOnFollowersButton', err, 'redo')})
        await instagram.page.waitFor(2000);

        // Get the element scroll
        var elementscroll = await instagram.page.$('main');

        // Limit for unfollow count
        while(unfollowed < limit) {
            
            console.log('its here.')
            // Need to be reviewed          #Modify
            
            followersButtons = await instagram.page.$x('//button[contains(., "Following")]');
            console.log('**button list:', followersButtons )
            f_name_list = await instagram.page.$$('a[title]')

            // count on has goten buttons
            for(var i= round; i<followersButtons.length; i++){
                perDelete.time = false
                
                // DO not unfollow protect users
                f_name = f_name_list[i];
                f_name = await instagram.page.evaluate(f_name => f_name.textContent, f_name);

                // If user is protected from unfollowing
                for(var proUser of saveList) {

                    if(proUser === f_name)
                        save = true;
                }
                if(save)
                    continue;
                
                for(let key in instagram.Following){

                    console.log('we are in the loop')

                    if(f_name === key){

                        if(methods.timePeriod(instagram.Following(key)) > unfollowPeriod){
                            delete instagram.Following.key
                            perDelete.time = true
                            
                        }

                    }
                    else{
                        if(perDelete.user)
                            perDelete.time = true
                    }
                }
                if(perDelete.time){

                    console.log('i is :', i)
                    var button = followersButtons[i];
                
                    console.log('**button: ', button)
                    text = await instagram.page.evaluate(button => button.textContent, button);
                    
                    console.log(text);
                    if(text === "Following") {
    
                        // Click on unfollow button
                        await instagram.click(button, '//button[contains(.,"Unfollow")]', 3000, '')
                        .catch((err) => {throw new _error(43, 'unfollow//clickOnnUnfollow button', err, 'redo')})
                        // button.click();
                        // await instagram.page.waitFor(1000)
                        // await instagram.page.waitFor('//button[contains(.,"Unfollow")]');
                        var admit = await instagram.page.$x('//button[contains(.,"Unfollow")]');
                        await admit[0].click();
                        console.log("clicked")
                        await instagram.page.waitFor(2000);
                        unfollowed++;
                    }
                } 
                round++;
                if(unfollowed >= 20)
                    break
            }
            var finish = await instagram.page.evaluate(elementscroll => {
                return Promise.resolve(
                    (elementscroll.scrollHeight - elementscroll.clientHeight) == Math.round(elementscroll.scrollTop)    ?1:0
            )},elementscroll)

        
            console.log(finish);
            if(finish)
                break
            await instagram.page.evaluate( elementscroll => elementscroll.scrollBy(0,500), elementscroll);

        }
        await instagram.page.waitFor(2000);
        return 'unfollow process has done perfectly'

    },
    sendDirect: async () => {

        /*this object make an independent page and load the feed url of the instagram 
        and check wether a new thing happen or not */
        console.log('sendDirect started')
 
        let directText = 'thanks for joining us.'
        let dialog = null
        var buttonList = [];
        var nameList = [];
        let activityList = [];

        // if page does not exist make it.
        if(instagram.page2 === null){

            instagram.page2 = await instagram.browser.newPage();                        // #Modify
            await instagram.page2.emulate(iPhone);
            await instagram.page2.goto(ActivityUrl, {waitFor: 'networkidle0', timeout: 30000})
            .then(() => console.log('ok'))
            .catch((rej) => console.log(rej))
        }


        // Check if page loaded properly
        await instagram.page2.waitFor('img')
        .then(() => console.log('we enter!'))
        .catch(() => {console.log('there is something wrong'); debugger;})

        // Wait for dialog crap
        await instagram.page2.waitFor('div[role="dialog"] button',{timeout:15000})
        .then(() => console.log('its come'))
        .catch(() => console.log('Oops'))

        dialog = await instagram.page2.$x('//button[contains(., "Cancel")]');
        if(dialog.length != 0){

            await Promise.all([
                instagram.page2.waitForNavigation({waitUntil: 'networkidle0', timeout: 5000}),
                dialog[0].click()
            ]).then(() => console.log('(second wall) navigate soccessfully'))
            .catch(rej => console.log('(second wall) navigation fail', rej));

        }

        // Get the items list
        // activityList = await instagram.page2.$$(`div[role="button"]:nth-child(${i})`)
        
        for (var i = 1; i <= 10; i++){


            // console.log('list',activityList,'\n activity', activityList[i])
            // Get the follow button if exist
            var followButton = await instagram.page2.$(`div[role="button"]:nth-child(${i}) button`)
            if(followButton === null)
                continue
            followButton = await instagram.page2.evaluate(element => element.textContent,followButton)
            console.log(followButton)
            if(followButton !== 'Follow')
                continue;
            // var isFollow = await instagram.page2.evaluate(element => element.textContent, followButton)
            
            // console.log(isFollow)
            // if(!isFollow)
            //     continue;
            
            // Get the item name
            var link = await instagram.page2.$(`div[role="button"]:nth-child(${i}) a[title]`)
            var linkName = await instagram.page2.evaluate(element => element.textContent,link);
            console.log('name',linkName)
            // If name is repetetive
            if(linkName === lastInFeed)
                break
            
            // Go to the page
            await Promise.all([
                instagram.page2.waitForNavigation({waituntil: 'networkidle0', timeout: 15000}),
                link.click()
            ]).then(() => console.log('everythings is ok'))
            .catch(() => console.log('it went wrong.'))

            // Wait for the page
            await instagram.page2.waitFor('//button[contains(.,"Follow Back")]')
            .catch(() => console.log('bad'))
            .then(() => {

                console.log('enter the user page')
            })
            await instagram.page.waitFor(1000)
            var button = await instagram.page2.$x('//button[contains(.,"Follow Back")]')
            button[0].click()
            instagram.Following[linkName] = new Date().getTime();



            // Waite for message button
            await instagram.page2.waitFor('//button[contains(.,"Message")]',{timeout:5000})
            await instagram.page2.waitFor(1000)

            // Click on message button
            button = await instagram.page2.$x('//button[contains(.,"Message")]')
            await Promise.all([
                
                instagram.page2.waitForNavigation({waituntil: 'networkidle0', timeout: 15000}),
                button[0].click()

            ]).then(() => console.log('message page'))
            .catch(() => console.log('ooh crap!'))

            await instagram.page2.waitFor('textarea[placeholder="Message..."]',{timeout:5000})
            .then(() => console.log('its appear'))
            .catch(() => console.log('timeout'))

            await instagram.page2.waitFor(2000)
            await instagram.page2.type('textarea', directText, {delay: 50});

            await instagram.page2.waitFor('//button[contains(.,"Send")]')
            button = await instagram.page2.$x('//button[contains(.,"Send")]')
            button[0].click()
            await instagram.page2.waitFor(2000)

            await instagram.page2.goto(ActivityUrl, {waitFor: 'networkidle0', timeout: 30000})
            .then(() => console.log('ok'))
            .catch((rej) => console.log(rej))



        }
    },
    /* this function get a link of a page and follow it */
    subFollow: async (pageLink,notFollowBusiness, notFollowPrivate) => {

        console.log('direct sending')

        var isBusiness
        var isPrivate

        var shouldFollow = false

        console.log('subFollow')
        await pageLink.click()

        await instagram.page.waitFor(3000)
        await instagram.click()
        await Promise.all([

            instagram.page.waitForNavigation({waituntil: 'networkidle0', timeout:10000}),
            instagram.page.reload()

        ]).then(() => console.log('good'))
        .catch(() => console.log('faild'))

        await instagram.page.waitFor('//button[contains(.,"Follow")]')
        await instagram.page.waitFor(1000);
        console.log('reload')

        isBusiness = await instagram.page.evaluate(() => {return window._sharedData.entry_data.ProfilePage[0].graphql.user.is_business_account})
        isPrivate = await instagram.page.evaluate(() => {return window._sharedData.entry_data.ProfilePage[0].graphql.user.is_private})

        console.log('business',isBusiness,'\nprivate', isPrivate)

        if(notFollowBusiness & !isBusiness)
            shouldFollow = true
        
        if(notFollowPrivate & !isPrivate)
            shouldFollow = true
        else shouldFollow = false

        // shouldFollow = notFollowBusiness & !isPrivate?true:false


        if(shouldFollow){

            var button = await instagram.page.$x('//button[contains(.,"Follow")]')
            await button[0].click();
        }

        await instagram.page.waitFor(2000)
        return shouldFollow
        
    },
    likeAndComment: async (link) => {

        console.log('likeAndComment')

        // Go to the post page
        await instagram.click(link, 'span[aria-label="Comment"]',10000)
        .catch((err) => {throw new _error(71, 'like&comment//clickOnLink', err, 'redo')})
        await instagram.page.waitFor(1000)

        let isLikable =await instagram.page.$('span[aria-label="Like"]');
        // If you haven't liked this post 
        if(isLikable) {

            // Like the post
            await instagram.page.click('span[aria-label="Like"]')
            .catch(() => {console.log('there is an error in clicking on like button')})

            // Add commnet

            await instagram.click('span[aria-label="Comment"]','textarea')
            .catch((err) => {
                console.log('there is an problem in loading commnet page', err)
            })

            await instagram.page.waitFor(1000)

            for(var i = 0; i<=3; i++){

                await instagram.page.type('textarea',"perfect",{delay: 50})
                await instagram.page.waitFor(500);
                await instagram.click('button[type="submit"]', `main ul ul a:nth-child(1)[title=${pageName}]`)
                .then(() => {i = 10;console.log('posted')})
                .catch(() => {
                    console.log('faild')
                    if(i ===3){
                        console.log('fiald to submit comment')
                    }
                })

            }
        }

    },
    goto_page: async(url, check='', timeout = 30000) => {

        // Goto the url
        console.log('loading page');

        await instagram.page.goto(url, {waitUntil: 'load', timeout: timeout})
        .then( async() => {

            // Check if load is done curectly
            if(check !== ''){
                await instagram.page.waitFor(check)
                .then(() => {
                    console.log('successful load')})
                .catch((err) => {
                    console.log('error in loading', err)
                    throw "page didn`t load"
                });
            }
        }).catch((rej) => {
            console.log('failed', rej)
            throw "page didn`t load"
        });

    },
    click: async(element, check='',timeout=10000, waitUntil='networkidle0') => {


        var link
        if(typeof element === 'object'){

            link = element
            console.log('element is an object')
        }
        else if(element.search('//') === 0){

            console.log('element is not an object')

            console.log('xpath')
            link = await instagram.page.$x(element)
            .catch(() => {throw 'element doesn`t exist'})
            link = link[0]
        }
        else if(element !== ''){
            
            console.log('normal element')
            link = await instagram.page.$(element)
            .catch(() => {throw 'element doesn`t exist'})
        }
        else{
            link = web.page
        }

        /* Click on seleced element and wait to load fully*/
        await Promise.all([

            instagram.page.waitForNavigation({waitUntil:waitUntil, timeout: timeout}),
            link.click()
    
        ])
        .then(() => console.log('click navigate soccessfully'))
        .catch(err => {

            console.log('click navigate failed', err)
            if(waitUntil !=='')
                throw 'click faild'
        })
        
        if(check != '') 
            await instagram.page.waitFor(check)
            .catch(() => {
                console.log('pattern didnt appear')
                throw 'error: pattern didn`t appear'
            })
            .then(() => {console.log('pattern catch')})
        await instagram.page.waitFor(1000);
    

    },
    destroy: async () => {
        await instagram.browser.close()
        .catch(() => {throw 'there is an error in closing browser'})
        throw new _error()
    }



}

class _error {
        
    
    constructor(code=0, addres='', text='error', action='none') {
        
        this.code = code
        this.addres = addres;
        this.msg = text;
        this.action = action;
    }
}


module.exports = instagram;