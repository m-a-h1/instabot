const path = require('../api/direction')
const web = require('../../interfaces/interfaces')
const _error = require('../../handler/errorClass')




module.exports = async function subFollow (pageLink,notFollowBusiness, notFollowPrivate) {

    console.log('subFollow is started.')

    let isBusiness
    let isPrivate

    let shouldFollow = false

    console.log('subFollow')
    await pageLink.click()          // go to the page
    .catch((err) => {throw new _error('subFollow/01','',err,'')})

    await web.page.waitFor(3000)
    await path.click('', '//button[contains(.,"Follow")]')          // it will reload the page
    .catch((err) => {throw new _error('subFollow/02','',err,'')})
    await web.page.waitFor(1000);
    console.log('reload')

    isBusiness = await web.page.evaluate(() => {return window._sharedData.entry_data.ProfilePage[0].graphql.user.is_business_account})
    isPrivate = await web.page.evaluate(() => {return window._sharedData.entry_data.ProfilePage[0].graphql.user.is_private})

    console.log('business',isBusiness,'\nprivate', isPrivate)

    if(notFollowBusiness & !isBusiness)
        shouldFollow = true
    
    notFollowPrivate & !isPrivate?shouldFollow = true:shouldFollow = false

    // shouldFollow = notFollowBusiness & !isPrivate?true:false


    if(shouldFollow){

        let button = await web.page.$x('//button[contains(.,"Follow")]')
        await button[0].click()

        web.page.waitFor('//button[contains(.,"Follow")]')
        .catch(() => {throw new _error('subFollow//3','','faild to click on follow button.','')} )
    }

    console.log('is page followd: ', shouldFollow)
    await web.page.waitFor(2000)
    return shouldFollow
    
}