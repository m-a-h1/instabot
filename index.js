const CronJob = require('Cron').CronJob;

// const ig = require('./instagram');
// const job = require('./schedule');
const handler = require('./src/common/handler/handler');


var tags = ['محرم']
var username = '_tohiid'
var password = '14#T579*q'


// console.log('before instantiation')
// const job1 = new CronJob('*/1 * * * * *',() => {
//     var date = new Date()
//     var time = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
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
    // await startApp()

    // await handler.followProcess_handler.run(tags);

    // await handler.unfollowProcess_handler.run()

    // await handler.likeTagsProcess_handler.run(tags);

    // await ig.login('amirtnt80@yahoo.com', '14#T579*q');

    // await ig.followProcess(['car']);

    // await ig.likeTagsProcess(['cars']);

    // await ig.unfollowProcess()

    // await ig.sendDirect()


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


var counter = 0
var result
async function startApp() {
    while(!(result = await start())){
        console.log('conter is : ', ++counter, result)
        await handler.close_handler.run()
    }
}