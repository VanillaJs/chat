var server= require('koa-static'),
    route = require('koa-route'),
    koa = require('koa'),
    path = require('path'),
    app = module.exports = koa(),
    co = require('co'),
    serveStatic = require('koa-serve-static');



app.use(serveStatic('../web/build/'));

if (!module.parent)
{
    co(function * (){
        app.listen(3333);
    });
}