const path = require('../api/direction')
const web = require('../../interfaces/interfaces')



module.exports = likeAndComment = async(link) => {
    console.log('likeAndComment')

    // Go to the post page
    await path.click(link, 'span[aria-label="Comment"]',10000)
    .catch((err) => {throw new _error(71, 'like&comment//clickOnLink', err, 'redo')})
    await web.page.waitFor(1000)

    let isLikable =await web.page.$('span[aria-label="Like"]');
    // If you haven't liked this post 
    if(isLikable) {

        // Like the post
        await web.page.click('span[aria-label="Like"]')
        .catch(() => {console.log('there is an error in clicking on like button')})

        // Add commnet

        await path.click('span[aria-label="Comment"]','textarea')
        .catch((err) => {
            console.log('there is an problem in loading commnet page', err)
        })

        await web.page.waitFor(1000)

        for(var i = 0; i<=3; i++){

            await web.page.type('textarea',"perfect",{delay: 50})
            await web.page.waitFor(500);
            await path.click('button[type="submit"]', `main ul ul a:nth-child(1)[title=${web.pageName}]`)
            .then(() => {i = 10;console.log('posted')})
            .catch(() => {
                console.log('faild')
                if(i ===3){
                    console.log('fiald to submit comment')
                }
            })

        }
    }
}