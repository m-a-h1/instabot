const path = require('../api/direction')
const web = require('../../interfaces/interfaces')
const act = require('../api/action')
const methods = require('../../methods/methods')
const followLoop = require('../processes/followLoopPro')
const subFollow = require('../processes/subFollowPro')
const likeLastPost = require('./likeLastPost')
const _error = require('../../handler/errorClass')



const follow = {
    tags : [],      // Tags array
    currentPage : '',       // The current page that try to get its followers    
    counter: {round: 0, hasFollowed : 0},       // The number of pages that has checked if should be followed
                                                // The number of pages that has followed
    start: async(tags) => {
        console.log('follow process started.')
        follow.tags = tags
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

            switch(tag.search('#')){
                case 0:
                    console.log('gaven is a tag.')
                    await path.goto_page(web.TAG_URL(tag.substring(1)), 'article > div:nth-child(1) img[decoding="auto"]')
                    .then(console.log('we are in tags'))
                    .catch((err) => {throw new _error('follow//loadTag/01', 'start',err, 'redo')})
                    // check the page
                    if(!await follow.checkPost())
                        return await follow.getToPostPage()
                    break
                case -1:
                    console.log('gaven is a page')
                    follow.currentPage = web.Page_URL(tag)
                    await path.goto_page(follow.currentPage, 'article > div:nth-child(1) img[decoding="auto"]')
                    .then(console.log('we are in tags'))
                    .catch((err) => {throw new _error('follow//loadTag/01', 'start',err, 'redo')})
                    return await follow.loopOnFollowButtons()
            }
        }

        
    },
    checkPost: async() => {
        console.log('check post is started.')

        let posts,post,used = true

        for(let i = 0; i <= 6; i++){

            posts = await web.page.$$('article > div:nth-child(1) img[decoding="auto"]');   // Get all postS.
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
    getToPostPage: async() => {         // Usually it should be the base for any break
        console.log('getToFollowPage is started.')

        let page
        follow.currentPage === ''? page = 'header > div:nth-child(2) a:nth-child(1)':page = follow.currentPage;
        console.log('---------page is : ', page)
        await act.loadPage(page)         
        .then(() => {follow.currentPage = web.page.url()})          // Save current page.
        .catch((err) => {
            err.addres = 'getToPostPage'
            err.code = 'follow/getToFollowPage'
            throw err
        })
        
        return await follow.loopOnFollowButtons()
    },
    loopOnFollowButtons: async() =>{
        console.log('we are in loopOnFollowButtons.')
        // Click on the followers link
        await web.page.waitFor(2000)
        await path.click('//a[contains(., "followers")]','img',10000)
        .catch((err) => {throw new _error('follow/loopOnFollowButton', 'loadTAG', err, 'redo')})
        await web.page.waitFor(2000);

        await followLoop(follow.counter)
        .then(async (res) =>{
            if(res === 'getToPostPage')
                await follow.getToPostPage()
            return true
        })
        .catch((err) => {
            throw err
        })
    }
}

module.exports = follow