const path = require('../api/direction')
const act = require('../api/action')
const web = require('../../interfaces/interfaces')
const _error = require('../../handler/errorClass')

const Login = {
    username:'',
    password:'',

    start: async(username, password) => {
        console.log('login is started.')
        this.username = username
        this.password = password
        console.log('username: ', username)
        console.log('password: ', password)
        return await Login.load()
    },
    load: async() =>{
        let login
        await path.goto_page(web.login_URL, '//button[contains(., "Log In")]')
        .catch(async (err) => {
            if(!await act.loginCheck())
                throw new _error('login/load','start', err, 'redo')
            login = true
        })
        if(login)
            return true
        return await Login.authenticate()
    },
    authenticate: async() => {
        return await act.authenticate(this.username, this.password)
        .catch((err) => {
            throw err
        })
    }
}

module.exports = Login