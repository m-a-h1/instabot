const web = require('../../interfaces/interfaces')
const subFollow = require('../processes/subFollowPro')
const likeLastPost = require('./likeLastPost')
const _error = require('../../handler/errorClass')




module.exports = async(counter) => {         // counter contains <round> and <hasfollowed>
    console.log('loop is started.')
    console.log('counter: ', counter)
    while(counter.hasFollowed <= web.limit){
        console.log('loop 1')
        let followButtons = await web.page.$$('button');
        for(let i= counter.round; i<followButtons.length; i++){
            console.log('loop 2')

            console.log('i,followed, round');
            console.log(i,' _ ', counter.hasFollowed, ' _ ', counter.round);

            followButtons = await web.page.$$('button');
            var linkPage = await web.page.$$('a[title]')
            let button = followButtons[i];
            
            let buttenText = await web.page.evaluate(button => button.textContent, button);
            var pageName = await web.page.evaluate((element) => element.textContent,linkPage[i]);
            
            console.log(buttenText);
            if(buttenText == "Follow") {
                let isFollowed = await subFollow(linkPage[i],web.notFollowBusinessPage,web.notFollowPrivatePage)
                .catch((err) => {
                    err.addres = 'getToFollowerPage'
                    err.action = 'redo'
                    throw err
                })
                if(isFollowed) {
                    counter.hasFollowed++;
                    web.following[pageName] = new Date().getTime();
                    if(likeLastPost){
                        await likeLastPost()
                        .catch((err) => {
                            throw err
                        })
                    }
                    if(counter.hasFollowed >= web.limit)
                        break
                }
                console.log('is followed: ', isFollowed)
                counter.round++
                return 'getToFollowerPage'
            }
            counter.round++
        }
        console.log('not yet!')
        // check limit
        if(counter.hasFollowed >= web.limit)
        return true
        // scroll
        console.log('goood by!')
        let elementscroll = await web.page.$('main');
        await web.page.evaluate( elementscroll => elementscroll.scrollBy(0,500), elementscroll);
    }
    web.allHasFollowed += counter.hasFollowed
    return true
}