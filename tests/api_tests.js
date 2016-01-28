/**
 * Created by kauserali on 22/01/16.
 */
'use strict';


var sinon = require('sinon');
var OAuth2Server = require('oauth2-server');

sinon.stub(OAuth2Server.prototype, 'authorise', function() {
    return function (req, res, next) {
        return next();
    };
});

var server = require('../bin/www');
var superagent = require('superagent');
var expect = require('chai').expect;

var scheme = 'http://';
var host = '127.0.0.1';
var port = '3000';
var url = scheme + host + ':' + port;

describe('API test suite', function() {
    describe('List api test suite', function() {
        before(function() {
            console.log('Starting the server');
            server.boot();
        });

        it('Retrieve all lists', function(done) {
            superagent.get(url + '/lists').end(function(err, res) {
                expect(res.statusCode).to.equal(200);
                expect(res.body).to.have.length.above(0);
                done();
            });
        });

        it('Retrieve a single list', function(done) {
            superagent.get(url + '/lists/1').end(function(err, res) {
                expect(res.statusCode).to.equal(200);
                expect(res.body).to.have.length(1);
                done();
            });
        });

        it('Update a list', function(done) {
            superagent.put(url + '/lists/1').send({ title : 'Updated list' }).end(function(err, res) {
                expect(res.statusCode).to.equal(200);
                expect(res.body).to.have.length(1);
                done();
            });
        });

        it('Create a list', function(done) {
            superagent.post(url + '/lists').send({ title : 'Creating new list' }).end(function(err, res) {
                expect(res.statusCode).to.equal(201);
                expect(res.body).to.have.length(1);
                done();
            });
        });

        it('Archive a list', function(done) {
            superagent.delete(url + '/lists/1').end(function(err, res) {
                expect(res.statusCode).to.equal(200);
                done();
            });
        });

        it('Retrieve all tasks', function(done) {
            superagent.get(url + '/lists/1/tasks').end(function(err, res) {
                expect(res.statusCode).to.equal(200);
                expect(res.body).to.have.length.above(1);
                done();
            });
        });

        it('Create a task', function(done) {
            superagent.post(url + '/lists/1/tasks').send( {task : 'New created task'}).end(function(err, res) {
                expect(res.statusCode).to.equal(201);
                expect(res.body[0].text).to.equal('New created task');
                done();
            });
        });

        it('Archive all tasks', function(done) {
            superagent.post(url + '/lists/1/tasks/archiveAll').send({ listId: '1'}).end(function(err, res) {
                expect(res.statusCode).to.equal(200);
                done();
            });
        });

        after(function() {
            console.log('Closing the server');
            server.shutdown();
        });
    });

    describe('Tasks api test suite', function() {
        before(function() {
            console.log('Starting the server');
            server.boot();
        });

        it('Retrieve a task', function(done) {
            superagent.get(url + '/tasks/1').end(function(err, res) {
                expect(res.statusCode).to.equal(200);
                expect(res.body[0].text).not.to.be.null;
                done();
            });
        });

        it('Update a task', function(done) {
            superagent.put(url + '/tasks/11').send({ text : 'Updated task'}).end(function(err, res) {
                expect(res.statusCode).to.equal(200);
                expect(res.body[0].text).to.equal('Updated task');
                done();
            });
        });

        after(function() {
            console.log('Closing the server');
            server.shutdown();
        });
    });
});

