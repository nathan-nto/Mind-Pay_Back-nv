'use strict'

/*
|--------------------------------------------------------------------------
| Http server
|--------------------------------------------------------------------------
|
| This file bootstraps Adonisjs to start the HTTP server. You are free to
| customize the process of booting the http server.
|
| """ Loading ace commands """
|     At times you may want to load ace commands when starting the HTTP server.
|     Same can be done by chaining `loadCommands()` method after
|
| """ Preloading files """
|     Also you can preload files by calling `preLoad('path/to/file')` method.
|     Make sure to pass a relative path from the project root.
*/
const axios = require('axios')
const CronJob = require('cron').CronJob


const job = new CronJob("0 */30 09 05 * *", async () => {
  try {
    // https://mindpay.mindconsulting.com.br/api
    // http://127.0.0.1:3333/requests/users
    const users = await axios.post('https://mindpay.mindconsulting.com.br/api/requests/users')
    
  } catch (err) {
    console.log(err)
  }

})
job.start()

const paydayT = new CronJob("0 */30 12 06 * *", async () => {
  try {
    // https://mindpay.mindconsulting.com.br/api
    // http://127.0.0.1:3333/requests/users
    const users = await axios.post('https://mindpay.mindconsulting.com.br/api/requests/users')
    
  } catch (err) {
    console.log(err)
  }

})
paydayT.start()

const sche = new CronJob("0 */20 09 * * *",  async () => {
  try{
    // https://mindpay.mindconsulting.com.br/api
    // http://127.0.0.1:3333/requests/birthday
    const happyBirthday = await axios.post('https://mindpay.mindconsulting.com.br/api/requests/birthday')

  }catch(err){
    console.log(err)
  }
})
sche.start()


const { Ignitor } = require('@adonisjs/ignitor')

new Ignitor(require('@adonisjs/fold'))
  .appRoot(__dirname)
  .fireHttpServer()
  .catch(console.error)
