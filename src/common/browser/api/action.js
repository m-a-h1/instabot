const web = require('../../interfaces/interfaces')
const act = require('../api/direction')
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
    
    }

    
}