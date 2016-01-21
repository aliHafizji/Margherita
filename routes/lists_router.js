/**
 * Created by kauserali on 19/01/16.
 */

'use strict';

var express = require('express');
var oauth = require('../oauth');
var router = express.Router();
var lists = require('../db/lists');
var tasks = require('../db/tasks');

router.get('/:listId', oauth.authorise(), function(req, res, next) {

    let listId = req.params.listId;
    lists.retrieveList(listId, function(error, lists) {
        if(!error) {
            res.send(lists);
        }
        next(error);
    });
});

router.get('/', oauth.authorise(), function(req, res, next) {
    lists.retrieveLists(function(error, lists) {
        if(!error) {
            res.send(lists);
        }
        next(error);
    });
});

router.post('/', oauth.authorise(), function(req, res, next) {
    let listTitle = req.body.title;
    lists.createList(listTitle, function(error, list) {
        if(!error) {
            res.statusCode = 201;
            res.send(list);
        }
        next(error);
    });
});

router.put('/:listId', oauth.authorise(), function(req, res, next) {
    let listId = req.params.listId;
    let listTitle = req.body.title;
    lists.updateList(listId, listTitle, function(error, list) {
        if(!error) {
            res.send(list);
        }
        next(error);
    });
});

router.delete('/:listId', oauth.authorise(), function(req, res, next) {
    let listId = req.params.listId;
    lists.archiveList(listId, function(error, list) {
        if (!error) {
            res.send(list);
        }
        next(error);
    });
});

router.get('/:listId/tasks', oauth.authorise(), function(req, res, next) {
    let listId = req.params.listId;
    tasks.retrieveTasks(listId, function(error, tasks) {
        if (!error) {
            if (tasks.length === 0) {
                let err = new Error('No tasks present');
                err.status = 404;
                next(err);
            } else {
                res.send(tasks);
            }
        }
        next(error);
    })
});

router.post('/:listId/tasks', oauth.authorise(), function(req, res, next) {

    let listId = req.params.listId;
    let task = req.body.task;
    tasks.createTask(listId, task, function(error, task) {
       if (!error) {
           res.statusCode = 201;
           res.send(task);
       }
       next(error);
    });
});

router.post('/:listId/tasks/archiveAll', function(req, res, next) {
    //archive all tasks
    let listId = req.params.listId;
    tasks.archiveTasks(listId, function(error, tasks) {
       if (!error) {
           res.send(tasks);
       }
       next(error);
    });
});

module.exports = router;