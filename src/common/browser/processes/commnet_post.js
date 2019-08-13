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
    //      write the comment
    await web.page.type('textarea',web.comment_text,{delay: 20})
    await web.page.waitFor(3000);
    console.log('i just jotdown the text')
    for(var i = 0; i<=3; i++){          // try three time to post the comment

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