const CronJob = require('Cron').CronJob;
const handler = require('./src/common/handler/handler');


let tags = ['محرم']
let names = ['kimyaesaadat.store']
let username = '_tohiid'
let password = '902411004'


// console.log('before instantiation')
// const job1 = new CronJob('*/1 * * * * *',() => {
//     let date = new Date()
//     let time = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
//     console.log('-------')
//     console.log('date',time)
// })

// console.log('after instantiaion')

// job1.start();



// const job2 = new job('*/1 * * * * *',() => {console.log('5')})
// const job3 = new job('*/2 * * * * *', () => {console.log('6')})
// job3.schedule().start();
// job2.schedule().start();


;(async () => {

    await startApp()
    await handler.follow.run(tags)
    // await handler.unfollow.run()


    // await handler.likeTagsProcess_handler.run(tags);


    // const followProcess = new job('0 7 13 * * *', () => {ig.followProcess(['car'])});

    // const unfollowProcess = new job('0 10 13 * * *', ig.unfollowProcess);

    // const likeAndCommentProcess = new job('0 13 13 * * *', () => {ig.likeTagsProcess(['cars'])});
    
    // followProcess.schedule().start()
    // unfollowProcess.schedule().start()
    // likeAndCommentProcess.schedule().start()

    

})();

async function start() {

    return await handler.initialize.run()
    .then(async(res) => {
        console.log('init response:', res)
        return await handler.login.run(username, password)
    })
    .then((res) => {
        console.log('login response: ', res)
        return true
    })
    .catch((err) => {
        console.log('fatal error initiation:', err)    
        return false
    })
}


let counter = 0
let result
async function startApp() {
    while(!(result = await start())){
        console.log('conter is : ', ++counter, result)
        await handler.close_handler.run()
    }
}