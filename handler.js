const insta = require('./instagram')

const handler = {
    state: "",
    username:null,
    password:null,

    // It handle the launching browser and opening new page
    init_handler: {
        fatal: null,
        round: 0,
        run: async(addres='start') => {
            return await insta.initialize[addres]()
            .then(res => {
                console.log('response: ', res)
                return res
            })
            .catch(async err => {
                console.log('err1: ', err)
                handler.init_handler.round += 1
                console.log('round is: ', handler.init_handler.round)
                if(handler.init_handler.round > 3){
                    console.log('round is uper than 3')
                    throw "there is an big problem in initiation"
                }
                if(err.action === "redo"){
                    console.log('redo')
                    await handler.init_handler.run(err.addres)
                }
                else{
                    console.log('go for error shooting')
                    throw err
                }
            })
        }
    },
    login_handler: {
        run: async(username, password, addres='start', reload) => {
            if(username != '' & password != ''){
                handler.username = username
                handler.password = password
            }
            return await insta.login[addres](reload,username, password)
            .then(res  => {
                console.log('response: ', res)
                return res
                
            })
            .catch(async err => {
                console.log('err2: ', err)
                if(err.action === 'redo')
                    await handler.login_handler.run('','',err.addres, true)
                else{
                    throw err.msg
                }
            })
        }

    },
    followProcess_handler: {
        run: async(tags) => {
            await insta.followProcess(tags)
            .then((res) =>{
                console.log('response: ', res)
                return res
            })
            .catch(async err => {
                console.log('error in follow process:', err)
                if(err.action=== 'redo')
                    await handler.followProcess_handler.run()
                else
                    throw 'fuck'
            })
        }

    },
    likeTagsProcess_handler: {
        run: async(tags, addres='start') => {
            return await insta.likeTagsProcess[addres](tags)
            .then((res) =>{
                console.log('response: ', res)
                return res
            })
            .catch(async (err) => {
                console.log('err4: ', err)
                if(err.action === 'redo')
                    await handler.likeTagsProcess_handler.run('',err.addres, true)
                else{
                    throw err
                }
            })
        }

    },
    unfollowProcess_handler: {
        run: async(tags) => {
            await insta.unfollowProcess()
            .then((res) =>{
                console.log('response: ', res)
                return res
            })
            .catch(async err => {
                console.log('error in unfollow process:', err)
                if(err.action=== 'redo')
                    await handler.followProcess_handler.run()
                else
                    throw 'fuck'
            })
        }

    },
    sendDirect_handler: {

    },
    subFollow_handler: {

    },
    close_handler:{
        run: async () => {
            await insta.destroy()
            .catch(async (err) => {
                console.log('close_error: ', err)
                await handler.close_handler.run()
            })
        } 
    }
}

module.exports = handler;