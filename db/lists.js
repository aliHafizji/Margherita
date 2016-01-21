'use strict';

var database = require('./database.js').database;
var connectionString = require('./database.js').connectionString;

var createList = function (title, callback) {
    database.connect(connectionString, function(error, client, done){
        if (error) {
            callback(error, null);
            done();
        } else {
            client.query('insert into list (title, created_at) values ($1, $2) returning *', [title, new Date()], function(err, result) {
                callback(err, result === undefined ? null : result.rows);
                done();
            });
        }
    });
};

var retrieveLists = function(callback) {
    database.connect(connectionString, function (error, client, done) {
        if (error) {
            callback(error, null);
            done();
        } else {

            let lists = [];

            let query = client.query('select * from list');
            query.on('row', function (row) {
                lists.push(row);
            });

            query.on('end', function (result) {
                callback(null, lists);
                done();
            });
        }
    });
};

var retrieveList = function(listId, callback) {
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
                        retrieveListDetails(listId, client, function(results) {
                            callback(null, results);
                            done();
                        });
                    }
                }
            });
        }
    });
};

var updateList = function(listId, title, callback) {
    database.connect(connectionString, function(error, client, done) {
        if (error) {
            callback(error, null);
            done();
        } else {
            client.query('update list set title = $1, updated_at = $2 where id=$3 returning *', [title, new Date(), listId], function(err, result){
                callback(err, result === undefined ? null : result.rows);
                done();
            });
        }
    });
};

var archiveList = function(listId, callback) {

    var rollback = function(client, done) {
        client.query('ROLLBACK', function(error) {
            callback(error, null);
            return done();
        });
    };

    database.connect(connectionString, function(error, client, done) {
        if (error) {
            callback(error, null);
            done();
        } else {

            client.query('select * from list where id=$1', [listId], function(err, result) {
                if (!result.rows[0].archived_at) {
                    client.query('BEGIN', function(err) {
                        if(err) {
                            return rollback(client, done)
                        }

                        process.nextTick(function() {
                            let date = new Date();
                            client.query('update list SET archived_at = $1 where id = $2', [date, listId], function(err) {
                                if(err) return rollback(client, done);
                                client.query('update task SET archived_at = $1 where list_id = $2', [date, listId], function(err) {
                                    if(err) return rollback(client, done);
                                    client.query('COMMIT', done);

                                    retrieveListDetails(listId, client, function(results) {
                                        callback(null, results);
                                        done();
                                    });
                                });
                            });
                        });
                    });
                } else {
                    callback(null, result.rows[0]);
                    done();
                }
            });


        }
    });
};

var retrieveListDetails = function(listId, databaseClient, callback) {
    let results = [];

    let query = databaseClient.query('select * from list where id = $1', [listId]);

    query.on('row', function(row) {
        results.push(row);
    });

    query.on('end', function(result) {
        callback(results);
    });
};

module.exports.createList = createList;
module.exports.retrieveLists = retrieveLists;
module.exports.retrieveList = retrieveList;
module.exports.updateList = updateList;
module.exports.archiveList = archiveList;