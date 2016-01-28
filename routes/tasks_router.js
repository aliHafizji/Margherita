/**
 * Created by kauserali on 19/01/16.
 */

'use strict';

var express = require('express');
var oauth = require('../oauth');
var router = express.Router();
var tasks = require('../db/tasks');

router.get('/:taskId', oauth.authorise(), function(req, res, next) {

    let taskId = req.params.taskId;

    tasks.retrieveTask(taskId, function(error, tasks) {
        if (!error) {
            res.send([tasks]);
        }
        next(error);
    });
});

router.put('/:taskId', oauth.authorise(), function(req, res, next) {
    let taskId = req.params.taskId;
    let text = req.body.text;

    tasks.updateTask(taskId, text, function(error, task) {
        if (!error) {
           res.send(task);
        }
        next(error);
    });
});

module.exports = router;