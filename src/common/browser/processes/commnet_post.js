const path = require('../api/direction')
const web = require('../../interfaces/interfaces')




module.exports = async () => {
    console.log('comment started')
    // Add commnet
    await path.click('span[aria-label="Comment"]','textarea')
    .catch((err) => {
        console.log('there is an problem in loading commnet page', err)
        throw err
    })

    await web.page.waitFor(1000)

    for(var i = 0; i<=3; i++){          // try three time to post the comment

        await web.page.type('textarea',"یا علی",{delay: 50})
        await web.page.waitFor(500);
        await path.click('button[type="submit"]', `main ul ul a:nth-child(1)[title=${web.pageName}]`)
        .then(() => {i = 10;console.log('posted')})
        .catch((err) => {
            console.log('faild')
            if(i >=3){
                console.log('fiald to submit comment')
                throw err
            }
        })

    }
}