const init = require('../browser/index')
const web = require('../interfaces/interfaces')
const login = require('../browser/processes/loginPro')
const follow = require('../browser/processes/followPro')

const handler = {
    
    initialize: {
        
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

        run: async(username, password, addres = 'start') => {
            return await login[addres](username, password)
            .then((resolve) => {console.log('login has done properly', resolve); return resolve})
            .catch((err) => {
                console.log('error in login: ', err)
                if(err.act = 'redo'){
                    handler.login.run(username, password,err.addres)
                }
                else
                    throw 'fatal error in login!'
            })
        }

    },
    follow: {

        failCounter:0,      // It count how many time program has faild.
        run: async(tags, addres='start') => {
            await follow[addres](tags)
            .then((resolve) => console.log('follow has done properly.', resolve))
            .catch((err) => {
                console.log('error in follow: ', err)
                if(err.act = 'redo'){
                    if(handler.follow.failCounter >= 5)
                        throw 'there is an problem in program.'
                    handler.follow.run(tags,err.addres)
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