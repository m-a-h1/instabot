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

        let page
        follow.currentPage === ''? page = 'header > div:nth-child(2) a:nth-child(1)':page = follow.currentPage;
        console.log('---------page is : ', page)
        await act.reachToFollowerPage(page)         
        .then(() => {follow.currentPage = web.page.url()})          // Save current page.
        .catch((err) => {
            err.addres = 'getToFollowerPage'
            err.code = 'follow/getToFollowPage'
            throw err
        })
        
        return await follow.loopOnFollowButtons()
    },
    loopOnFollowButtons: async() =>{
        console.log('we are in loopOnFollowButtons.')
        await followLoop(follow.counter)
        .then(async (res) =>{
            if(res === 'getToFollowerPage')
                await follow.getToFollowerPage()
            return true
        })
        .catch((err) => {
            throw err
        })
    }
}

module.exports = follow