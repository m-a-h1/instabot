const path = require('../api/direction')
const web = require('../../interfaces/interfaces')
const act = require('../api/action')
const comment = require('../processes/commnet_post')
const _error = require('../../handler/errorClass')



module.exports = likeAndComment = async(link) => {
    console.log('likeAndComment')

    // Go to the post page
    await path.click(link, 'span[aria-label="Comment"]',10000)
    .catch((err) => {throw new _error('like&comment/01', 'start', err, 'redo')})
    await web.page.waitFor(1000)

    await act.like()        // like the post
    .then(await comment())      // comment the post
    .catch((err) => {
        throw new _error('like&comment/02','start',err,'redo')
    })
}