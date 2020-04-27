# Tour application

## 배포

```bash
$ heroku login
$ heroku create
$ heroku config:set NODE_ENV=
$ heroku config:set DATABASE=
$ heroku config:set DATABASE_PASSWORD=
$ heroku config:set JWT_SECRET=
$ heroku config:set JWT_EXPIRES_IN=
$ heroku config:set JWT_COOKIE_EXPIRES_IN=
$ heroku config:set STRIPE_SECRET_KEY=

$ git add *
$ git push heroku master
$ heroku open
$ heroku apps:rename patours
```
