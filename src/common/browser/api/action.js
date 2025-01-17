const web = require('../../interfaces/interfaces')
const act = require('../api/direction')
const path = require('../api/direction')
const _error = require('../../handler/errorClass')


module.exports = {

    authenticate: async (username, password) => {

        console.log('turn to enter the text')
        await web.page.waitFor(2000)
        /* writeing the username and password */
        await web.page.type('input[name="username"]', username, {delay: 50});
        await web.page.type('input[name="password"]', password, {delay: 50});

        console.log('typing is done')

        //click on login button
        await act.click('//button[contains(., "Log In")]','',30000)
        .catch(async (err) => {
            throw new _error('action/auth','start',err, 'redo')
        })
        console.log('auth has done!')
        return true
    },
    loginCheck: async () => {
        console.log('check start')
    
        let loginID = await web.page.evaluate(() => {return window._sharedData.config.viewerId})
        console.log('loginID: ', loginID)
        if(loginID){
            console.log('we are loged in')
            await web.page.waitFor('a > span[aria-label="Profile"]')
            .catch(console.log('pattern didnt appear at loading profile'))
            await web.page.waitFor(2000);
            return true
        }
        console.log('are not loged in')
        return false
    
    },
    unfollow: async (button) => {
        let text = await web.page.evaluate(button => button.textContent, button);
                    
        console.log(text);
        if(text === "Following") {

            // Click on unfollow button
            await path.click(button, '//button[contains(.,"Unfollow")]', 3000, '')
            .catch((err) => {throw err})
            let admit = await web.page.$x('//button[contains(.,"Unfollow")]')
            await admit[0].click();
            console.log("clicked")
            return true
        }
        return false
    },
    like: async () => {
        let isLikable =await web.page.$('span[aria-label="Like"]');
        // If you haven't liked this post 
        if(isLikable) {
            // Like the post
            await web.page.click('span[aria-label="Like"]')
            .catch((err) => {
                console.log('there is an error in clicking on like button')
                throw err
            })
            return true
        }
        return false
    },
    loadPage: async(page) => {
        console.log('reachToFollowerpage started.')
        
        if(page.search('header') === 0){
            console.log('it user the path')
            await path.click(page, 'ul > li:nth-child(2) > a',10000)   // Click on page link
            .then()
            .catch((err) => {throw new _error('action/loadpage', '', '2:'+err, 'redo')})
            await web.page.waitFor(2000);
        }
        else {    // If there was a current page
            console.log('it use current url')
            await path.goto_page(page, 'ul > li:nth-child(2) > a')
            .catch((err) => {throw new _error('actoin/loadpage', '', '1:'+err, 'redo') })
            await web.page.waitFor(2000);
        }
    },

}