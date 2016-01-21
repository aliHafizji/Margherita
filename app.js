"use strict";

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var bodyParser = require('body-parser');
var oauth = require('./oauth.js');

var listsRouter = require('./routes/lists_router');
var tasksRouter = require('./routes/tasks_router');

var app = express();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.all('/oauth/token', oauth.grant());

app.use('/lists', listsRouter);
app.use('/tasks', tasksRouter);

app.use(oauth.errorHandler());

app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.send({
        'code': (err.status || 500),
        'error': err.name,
        'message': err.message
    });
});

module.exports = app;
