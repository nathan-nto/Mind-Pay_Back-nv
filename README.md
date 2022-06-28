# Adonis API application

This is the boilerplate for creating an API server in AdonisJs, it comes pre-configured with.

1. Bodyparser
2. Authentication
3. CORS
4. Lucid ORM
5. Migrations and seeds

## Setup

Use the adonis command to install the blueprint

```bash
adonis new yardstick --api-only
```

or manually clone the repo and then run `npm install`.


### Migrations

Run the following command to run startup migrations.

```js
adonis migration:run
```

### routes 

┌───────────────┬──────────┬────────────────────────────────────┬─────────────────┬───────────────┬────────┐
│ Route         │ Verb(s)  │ Handler                            │ Middleware      │ Name          │ Domain │
├───────────────┼──────────┼────────────────────────────────────┼─────────────────┼───────────────┼────────┤
│ /request/:id  │ HEAD,GET │ RequestController.findOneAll       │                 │ /request/:id  │        │
├───────────────┼──────────┼────────────────────────────────────┼─────────────────┼───────────────┼────────┤
│ /user         │ HEAD,GET │ UserController.getOne              │ auth            │ /user         │        │
├───────────────┼──────────┼────────────────────────────────────┼─────────────────┼───────────────┼────────┤
│ /request      │ POST     │ RequestController.store            │ auth            │ /request      │        │
├───────────────┼──────────┼────────────────────────────────────┼─────────────────┼───────────────┼────────┤
│ /requests     │ HEAD,GET │ RequestController.findOneAll       │ auth            │ /requests     │        │
├───────────────┼──────────┼────────────────────────────────────┼─────────────────┼───────────────┼────────┤
│ /register     │ PUT      │ UserController.update              │ auth,file       │ /register     │        │
├───────────────┼──────────┼────────────────────────────────────┼─────────────────┼───────────────┼────────┤
│ /users        │ HEAD,GET │ UserController.getAll              │ auth,admin      │ /users        │        │
├───────────────┼──────────┼────────────────────────────────────┼─────────────────┼───────────────┼────────┤
│ /requests/:id │ HEAD,GET │ RequestController.findUserRequests │ auth,admin      │ /requests/:id │        │
├───────────────┼──────────┼────────────────────────────────────┼─────────────────┼───────────────┼────────┤
│ /requests/:id │ PUT      │ RequestController.respondRequest   │ auth,admin,file │ /requests/:id │        │
├───────────────┼──────────┼────────────────────────────────────┼─────────────────┼───────────────┼────────┤
│ /login        │ POST     │ SessionController.login            │ formatCpf       │ /login        │        │
├───────────────┼──────────┼────────────────────────────────────┼─────────────────┼───────────────┼────────┤
│ /admin/login  │ POST     │ SessionController.loginAsAdmin     │ formatCpf       │ /admin/login  │        │
├───────────────┼──────────┼────────────────────────────────────┼─────────────────┼───────────────┼────────┤
│ /register     │ POST     │ SessionController.register         │ formatCpf       │ /register     │        │
└───────────────┴──────────┴────────────────────────────────────┴─────────────────┴───────────────┴────────┘

