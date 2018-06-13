const {DBUSER, DBPASSWORD, DBURL} = require('./databaseinfo.js')
const user = process.env.DBUSER || DBUSER;
const pass = process.env.DBPASSWORD || DBPASSWORD;
const url = process.env.DBURL || DBURL;
module.exports = {


    // mongoDBUrl: 'mongodb://127.0.0.1/cms'
    mongoDBUrl: `mongodb://${user}:${pass}@${url}`


}