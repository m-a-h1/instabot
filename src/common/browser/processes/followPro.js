const path = require('../api/direction')
const web = require('../../interfaces/interfaces')
const act = require('../api/action')
const methods = require('../../methods/methods')
const subFollow = require('../processes/subFollowPro')
const likeLastPost = require('./likeLastPost')
const _error = require('../../handler/errorClass')



const follow = {
    tags : [],      // Tags array
    limit : 20,     // The maximum number that should be followed
    notFollowBusinessPage:false,        // If it should follow the buisness pages
    notFollowPrivatePage : true,        // If it should follow the private pages
    hasFollowed : 0,        // The number of pages that has followed
    currentPage : '',       // The current page that try to get its followers
    round: 0,       // The number of pages that has checked if should be followed
    start: async(tags) => {
        console.log('follow process started.')
        follow.tags = tags
        follow.limit
        console.log('currentPage: ', follow.currentPage)
        if(await act.loginCheck())
            return await follow.loadTAG()
        else {
            // Should start to login
        }
    },
    loadTAG: async() =>{
        console.log('here we are')
        
        for(let tag of follow.tags) {
            console.log('tag name: ', tag)
            
            await path.goto_page(web.TAG_URL(tag), 'article > div:nth-child(1) img[decoding="auto"]')
            .then(console.log('we are in tags'))
            .catch((err) => {throw new _error('follow//loadTag/01', 'start',err, 'redo')})

            if(!await follow.checkPost())
                break
        }

        return await follow.getToFollowerPage()
    },
    checkPost: async() => {
        console.log('check post is started.')

        let posts,post,used = true

        for(let i = 0; i <= 6; i++){

            posts = await web.page.$$('article > div:nth-child(1) img[decoding="auto"]');   // Get all post.
            post = posts[i];
    
            // Click on the post
            await web.page.waitFor(2000)
            await path.click(post, 'header > div:nth-child(2) a:nth-child(1)', 5000)     // Click on one post.
            .then(()=> load = true)
            .catch((err) => {throw new _error('follow//checkPost/01','start', err, 'redo')})
    
            await web.page.waitFor(1000);
    
            // Check if page was already used
            title = web.page.$('header > div:nth-child(2) a:nth-child(1)');
            title = web.page.evaluate(title => title.textContent,title);
            
            used = methods.check(title, web.used_pages)
            if(!used)
                break;
            // If used.
            await web.page.click('span[aria-label="Back"]')
            await web.page.waitFor(1000);
        }
        return used
    },
    getToFollowerPage: async() => {         // Usually it should be the base for any break
        console.log('getToFollowPage is started.')

        if(follow.currentPage === '') {    // If there was a current page
            await path.click('header > div:nth-child(2) a:nth-child(1)', 'ul > li:nth-child(2) > a',10000)   // Click on page link
            .then()
            .catch((err) => {throw new _error('follow/getToFollowPage/01', 'getTOFollowerPage', err, 'redo')})
            await web.page.waitFor(2000);
    
            // Save current page.
            follow.currentPage = await web.page.url();
        }
        else{
            await path.goto_page(follow.currentPage, 'ul > li:nth-child(2) > a')
            .catch((err) => {throw new _error('follow/getToFollowerPage/02', 'getTOFollowerPage', err, 'redo') })
            await web.page.waitFor(2000);
        }

        // Click on the followers link
        await path.click('//a[contains(., "followers")]','img',10000)
        .catch((err) => {throw new _error('follow//getToFollowerPage/03', 'getTOFollowerPage', err, 'redo')})
        await web.page.waitFor(2000);

        return await follow.loopOnFollowButtons()
    },
    loopOnFollowButtons: async() =>{
        console.log('loop is started.')
        while(follow.hasFollowed <= follow.limit){
            console.log('loop 1')
            let followButtons = await web.page.$$('button');
            for(let i= follow.round; i<followButtons.length; i++){
                console.log('loop 2')
    
                console.log('i,followed, round');
                console.log(i,' _ ', follow.hasFollowed, ' _ ', follow.round);

                followButtons = await web.page.$$('button');
                var linkPage = await web.page.$$('a[title]')
                let button = followButtons[i];
                
                let buttenText = await web.page.evaluate(button => button.textContent, button);
                var pageName = await web.page.evaluate((element) => element.textContent,linkPage[i]);
                
                console.log(buttenText);
                if(buttenText == "Follow") {
                    let isFollowed = await subFollow(linkPage[i],follow.notFollowBusinessPage,follow.notFollowPrivatePage)
                    .catch((err) => {
                        err.addres = 'getToFollowerPage'
                        err.action = 'redo'
                        throw err
                    })
                    if(isFollowed) {
                        follow.hasFollowed++;
                        web.following[pageName] = new Date().getTime();
                        if(likeLastPost){
                            await likeLastPost()
                        }
                        if(follow.hasFollowed >= follow.limit)
                            break
                    }
                    follow.round++
                    await follow.getToFollowerPage()
                    console.log('heeeeeyyyy!!!!!')
                }
                follow.round++
            }
            // check limit
            if(follow.hasFollowed >= follow.limit)
                return true
            // scroll
            let elementscroll = await web.page.$('main');
            await web.page.evaluate( elementscroll => elementscroll.scrollBy(0,500), elementscroll);
        }
        web.allHasFollowed += follow.hasFollowed
        return true
    }
}

module.exports = follow