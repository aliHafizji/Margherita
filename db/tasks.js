"use strict";

var database = require('./database.js').database;
var connectionString = require('./database.js').connectionString;

var retrieveTasks = function(listId, callback) {
    database.connect(connectionString, function(error, client, done) {
        if (error) {
            callback(error, null);
            done();
        } else {
            client.query('select * from list where id = $1', [listId], function(err, result) {
               if (err) {
                   callback(err, null);
                   done();
               } else {
                   if (result.rows.length === 0) {
                       let noListError = new Error('List not present');
                       noListError.status = 404;
                       callback(noListError, null);
                       done();
                   } else {
                       let query = client.query('select * from task where list_id = $1', [listId]);
                       retrieveResultsOfQuery(query, function(tasks) {
                           callback(null, tasks);
                           done();
                       });
                   }
               }
            });
        }
    });
};

var retrieveTask = function(taskId, callback) {
    database.connect(connectionString, function(error, client, done) {
       if (error) {
           callback(error, null);
           done();
       } else {
           let query = client.query("select * from task where id = $1", [taskId], function(err, result) {
               if (err) {
                   callback(err, null);
                   done();
               } else {
                   if (result.rows.length === 0) {
                       let noTaskError = new Error('Task not present');
                       noTaskError.status = 404;
                       callback(noTaskError, null);
                       done();
                   } else {
                       retrieveResultsOfQuery(query, function(tasks) {
                           callback(null, tasks);
                           done();
                       });
                   }
               }
           });
       }
    });
};

var createTask = function(listId, task, callback) {
    database.connect(connectionString, function(error, client, done) {
        if (error) {
            callback(error, null);
            done();
        } else {
            client.query('INSERT INTO task (list_id, text, created_at) VALUES($1, $2, $3) returning *', [listId, task, new Date()], function(err, result) {
                callback(err, result === undefined ? null : result.rows);
                done();
            });
        }
    });
};

var updateTask = function(taskId, task, callback) {
    database.connect(connectionString, function(error, client, done) {
        if (error) {
            callback(error, null);
            done();
        } else {
            client.query('UPDATE task SET text = $1, updated_at = $2 where id = $3 returning *', [task, new Date(), taskId], function(err, result) {
                callback(err, result === undefined ? null : result.rows);
                done();
            });
        }
    });
};

var archiveTask = function(taskId, callback) {
    database.connect(connectionString, function(error, client, done) {
        if (error) {
            callback(error, null);
            done();
        } else {
            client.query('UPDATE task SET archived_at = $1 where id = $2 returning *', [new Date(), taskId], function (err, result) {
                callback(err, result === undefined ? null : result.rows);
                done();
            });
        }
    });
};

var archiveTasks = function(listId, callback) {
    database.connect(connectionString, function(error, client, done) {
        if (error) {
            callback(error, null);
            done();
        } else {
            client.query('UPDATE task SET archived_at = $1 where list_id = $2 returning *', [new Date(), listId], function (err, result) {
                callback(err, result === undefined ? null : result.rows);
                done();
            });
        }
    });
};

var retrieveResultsOfQuery = function(query, callback) {
    let results = [];
    query.on('row', function(row) {
        results.push(row);
    });

    query.on('end', function(result) {
        callback(results);
    });
};

module.exports.archiveTasks = archiveTasks;
module.exports.retrieveTasks = retrieveTasks;
module.exports.retrieveTask = retrieveTask;
module.exports.createTask = createTask;
module.exports.updateTask = updateTask;
module.exports.archiveTask = archiveTask;
