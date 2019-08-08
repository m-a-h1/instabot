const init = require('../browser/index')
const web = require('../interfaces/interfaces')
const login = require('../browser/processes/loginPro')
const follow = require('../browser/processes/followPro')
const unfollow = require('../browser/processes/unfollowProcess')
const likeAndComment = require('../browser/processes/likeAndCommentPro')

const handler = {

    initialize: {
        failCounter: 0,      // It count how many time program has faild.
        run: async() => {

            await init.create()
            .catch((err) => {
                console.log('err1', err)
                throw err
            })
            await init.newPage()
            .catch((err) => {
                console.log('err2', err)
                throw err
            })
            return true
        }
    },

    login: {
        failCounter: 0,      // It count how many time program has faild.
        run: async(username, password, addres = 'start') => {
            return await login[addres](username, password)
            .then((resolve) => {console.log('login has done properly', resolve); return resolve})
            .catch((err) => {
                console.log('error in login: ', err)
                handler.login.failCounter++
                console.log('faild number',handler.login.failCounter)
                if(err.action = 'redo'){
                    if(handler.login.failCounter >= 3){
                        console.log('oooooooooooooo')
                        throw 'there is an problem in program.'
                    }
                    handler.login.run(username, password,err.addres)
                }
                else
                    throw 'fatal error in login!'
            })
        }

    },
    follow: {

        failCounter: 0,      // It count how many time program has faild.
        run: async(tags, addres='start') => {
            await follow[addres](tags)
            .then((resolve) => console.log('follow has done properly.', resolve))
            .catch((err) => {
                console.log('error in follow: ', err)
                handler.follow.failCounter++
                if(err.action === 'redo'){
                    if(handler.follow.failCounter >= 5)
                        throw 'there is an problem in program.'
                    console.log('iiiiiii aaaam heeere!')
                    handler.follow.run(tags,err.addres)
                }
                else
                    throw 'fatal error in login'
            })
        }

    },
    unfollow: {

        failCounter:0,      // It count how many time program has faild.
        run: async(addres='start') => {
            await unfollow[addres]()
            .then((resolve) => console.log('unfollow has done properly.', resolve))
            .catch((err) => {
                console.log('error in unfollow: ', err)
                handler.unfollow.failCounter++
                if(err.action = 'redo'){
                    if(handler.unfollow.failCounter >= 5)
                        throw 'there is an problem in program.'
                    handler.unfollow.run()
                }
                else
                    throw 'fatal error in login'
            })
        }

    },
    likeAndComment: async () => {
        run: async(item) => {
            await likeAndComment(item)
            .then((resolve) => console.log('unfollow has done properly.', resolve))
            .catch((err) => {
                console.log('error in unfollow: ', err)
                handler.unfollow.failCounter++
                if(err.action = 'redo'){
                    if(handler.unfollow.failCounter >= 5)
                        throw 'there is an problem in program.'
                    handler.unfollow.run()
                }
                else
                    throw 'fatal error in login'
            })
        }
    },
    closeBrowser: {
        run: async() => {
            web.browser.close()
        }
    }
}

module.exports = handler