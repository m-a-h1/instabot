const web = require('../../interfaces/interfaces')

module.exports = {
    
    goto_page: async (url, check='', timeout = 30000) => {
    
        // Goto the url
        console.log('loading page');
    
        web.page.waitFor(2000)
        await web.page.goto(url, {waitUntil: 'load', timeout: timeout})
        .then( async() => {
    
            // Check if load is done curectly
            if(check !== ''){
                await web.page.waitFor(check)
                .then(() => {
                    console.log('successful load')})
                .catch((err) => {
                    console.log('error in loading', err)
                    throw "page didn`t load"
                });
            }
        }).catch((rej) => {
            console.log('failed', rej)
            throw "page didn`t load"
        });
    
    },

    click: async(element, check='',timeout=10000, waitUntil='networkidle0') => {

        let link
        let click = 'click'
        if(typeof element === 'object'){

            link = element
            console.log('element is an object')
        }
        else if(element.search('//') === 0){

            console.log('element is not an object')

            console.log('xpath')
            link = await web.page.$x(element)
            .catch(() => {throw 'element doesn`t exist'})
            link = link[0]
        }
        else if(element !== ''){
            
            console.log('normal element')
            link = await web.page.$(element)
            .catch(() => {throw 'element doesn`t exist'})
        }
        else{
            link = web.page
            click = 'reload'
        }

        web.page.waitFor(2000)
        /* Click on seleced element and wait to load fully*/
        await Promise.all([

            web.page.waitForNavigation({waitUntil:waitUntil, timeout: timeout}),
            link[click]()
    
        ])
        .then(() => console.log('click navigate soccessfully'))
        .catch(err => {

            console.log('click navigate failed', err)
            if(waitUntil !=='')         // sometimes click action does not lead to a direction change.
                throw 'click faild'
        })
        
        if(check != '') 
            await web.page.waitFor(check)
            .catch(() => {
                console.log('pattern didnt appear')
                throw 'error: pattern didn`t appear'
            })
            .then(() => {console.log('pattern catch')})
        await web.page.waitFor(1000);
    

    },
    
}




