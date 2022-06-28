'use strict'

const { route } = require('@adonisjs/framework/src/Route/Manager');
const UserController = require('../app/Controllers/Http/UserController');

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URLs and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

const Route = use('Route');
const Helpers = use('Helpers');

Route.get('/media/:file', async ({ params, response }) => {
  response.download(Helpers.tmpPath(`uploads/${params.file}`))
})
Route.group(() => {

  Route.get('/user', 'UserController.getOne');
  Route.post('/request', 'RequestController.store');
  Route.get('/request', 'RequestController.findOneAll');
  Route.put("/register", "UserController.update").middleware('file');
  Route.patch("/user/profile/", "UserController.updatePicture").middleware('file');

})

Route.group(() => {

  Route.get('/user/:id', 'UserController.getOne');
  Route.get('/users', 'UserController.getAll');
  Route.delete('/user/:id', 'UserController.destroy');

  Route.get('/requests/all', 'RequestController.index');
  Route.get('/requests/:id', 'RequestController.findUserRequests');
  Route.put('/requests/:id', 'RequestController.respondRequest').middleware('file');

  Route.patch("/user/profile/:id", "UserController.updatePicture").middleware('file');

  Route.put("/user/:id", "UserController.update")
  Route.put("/user/", "UserController.update")

  Route.get('/users/count', "DashboardController.howManyUsers");
  Route.get('/users/payments', "DashboardController.paymentsPerYearMonth");

  Route.post('users/filter', "DashboardController.minderFilter")


})

Route.post('/requests/users', 'RequestController.schedule');
Route.post('/requests/birthday', 'RequestController.birthday');

Route.group(() => {

  Route.post("/login", "SessionController.login");
  Route.post("/admin/login", "SessionController.loginAsAdmin");
  Route.post("/register", "SessionController.register").middleware('file');;

}).middleware('formatCpf');
