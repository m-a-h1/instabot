const likeAndComment = require('./likeAndCommentPro')
const web = require('../../interfaces/interfaces')



module.exports = async function likeLastPost() {
    let private = await web.page.evaluate(() => {return window._sharedData.entry_data.ProfilePage[0].graphql.user.is_private})
    let hasPost 
    if (!private){

        hasPost = await web.page.$('li span span')
        hasPost = await web.page.evaluate(element => element.textContent, hasPost)
        if(hasPost != "0"){

            let link = await web.page.$('article div a')
            await likeAndComment(link)
            .catch((err) => {
                throw err
            })
        }
    }
}