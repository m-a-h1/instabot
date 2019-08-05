const puppeteer = require('puppeteer');
const web = require('../interfaces/interfaces')

const iPhone = puppeteer.devices['iPhone 6']
let browser
let page

const initializeBrowser = {

    create: async () =>{
        
        console.log('lunch started')
        browser = await puppeteer.launch({
            headless: false,
            executablePath: './chrome-win/chrome.exe'
            
        })
        .then()
        .catch((err) => {throw new _error(11 ,'lunch', err, 'redo')});
        web.browser = browser
    },
    
    newPage: async () => {

        console.log('newpage started')
        page = await browser.newPage()
        .catch(() => {throw new _error(12, 'init,newpage', 'error: lunch problem', 'redo')})
        await page.emulate(iPhone);
        await page.waitFor(1000);
        web.page = page
    }

}

module.exports = initializeBrowser
