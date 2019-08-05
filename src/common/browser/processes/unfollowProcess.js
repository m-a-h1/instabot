const path = require('../api/direction')
const web = require('../../interfaces/interfaces')
const act = require('../api/action')
const methods = require('../../methods/methods')
const _error = require('../../handler/errorClass')



const unfollow = {

    round: 0,           // Number of pages that has checked
    text:'',        
    hasUnfollowed: 0,           // Number of pages that has unfollowed
    followingNameList:[],           // List of following names
    followingName:'',           // name of one following name
    followersButtons:[],            // List of buttons
    perDelete: {user:true, time:false},         // Unfollow pages over their time
    save: false,        // #Modify to turn to boolean.
    limit: 20,          // The number that limit the number of unfollowing
    saveList: [         // List of protected pages from being unfollow
        'human_david',
        'pariaakhavass',
        'developers_team'
    ],

          // The number of pages that has checked if should be followed
    start: async(tags) => {
        console.log('unfollow process startd.')
        return await loadFollowingPage()
     
    },
    loadFollowingPage: async() =>{
        console.log('here we are')
        
            // Goto profile
        await path.goto_page(`https://www.instagram.com/${web.pageName}/`, `a[href="/${web.pageName}/followers/"]`, 20000)
        .catch((err) => {throw new _error('unfollow/loadFollowingPage/01', 'loadFollowingPage', err, 'redo')})
        
        // Click on followers button
        await path.click(`a[href="/${web.pageName}/following/"]`, 'img', 5000)
        .catch((err) => {throw new _error('unfollow/loadFollowingPage/02', 'loadFollowingPage', err, 'redo')})
        await web.page.waitFor(2000);

        
    },
    checkPost: async() => {
        console.log('check post is started.')

        
    },
    getToFollowerPage: async() => {
        console.log('getToFollowPage is started.')

        
        
    },
    loopOnUnfollowButtons: async() =>{
        console.log('loop is started.')

        // Limit for unfollow count
        while(unfollow.hasUnfollowed < unfollow.limit) {
            
            console.log('its here.')
            // Need to be reviewed          #Modify
            
            unfollow.followersButtons = await web.page.$x('//button[contains(., "Following")]');    // Following button list
            console.log('**button list:', unfollow.followersButtons )
            unfollow.followingNameList = await web.page.$$('a[title]')        // List of following names in order to check if thay are protected or not

            // count on has goten buttons
            for(let i= unfollow.round; i<unfollow.followersButtons.length; i++){
                perDelete.time = false
                
                // DO not unfollow protect users
                unfollow.followingName = followingNameList[i];
                unfollow.followingName = await web.page.evaluate(followingName => followingName.textContent, unfollow.followingName);

                // If user is protected from unfollowing
                for(let proUser of unfollow.saveList) {

                    if(proUser === unfollow.followingName)
                        save = true;
                }
                if(save)
                    continue;
                
                for(let key in web.Following){

                    console.log('we are in the loop')

                    if(unfollow.followingName === key){

                        if(methods.timePeriod(web.Following(key)) > unfollowPeriod){
                            delete web.following.key
                            unfollow.perDelete.time = true
                            
                        }

                    }
                    else{
                        if(unfollow.perDelete.user)
                            unfollow.perDelete.time = true
                    }
                }
                if(unfollow.perDelete.time){

                    console.log('i is :', i)
                    let button = unfollow.followersButtons[i];
                
                    console.log('**button: ', button)
                    text = await web.page.evaluate(button => button.textContent, button);
                    
                    console.log(text);
                    if(text === "Following") {

                        // Click on unfollow button
                        await web.click(button, '//button[contains(.,"Unfollow")]', 3000, '')
                        .catch((err) => {throw new _error(43, 'unfollow//clickOnnUnfollow button', err, 'redo')})
                        // button.click();
                        // await web.page.waitFor(1000)
                        // await web.page.waitFor('//button[contains(.,"Unfollow")]');
                        let admit = await web.page.$x('//button[contains(.,"Unfollow")]');
                        await admit[0].click();
                        console.log("clicked")
                        await web.page.waitFor(2000);
                        unfollowed++;
                    }
                } 
                round++;
                if(unfollow.hasUnfollowed >= 20)
                    break
            }
            // Get the element scroll
            let elementscroll = await web.page.$('main');
            let finish = await web.page.evaluate(elementscroll => {
                return Promise.resolve(
                    (elementscroll.scrollHeight - elementscroll.clientHeight) == Math.round(elementscroll.scrollTop)    ?1:0
            )},elementscroll)

        
            console.log(finish);
            if(finish)
                break
            await web.page.evaluate( elementscroll => elementscroll.scrollBy(0,500), elementscroll);

        }
        await web.page.waitFor(2000);
        return 'unfollow process has done perfectly'
            
    }
}

module.exports = unfollow