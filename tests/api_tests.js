/**
 * Created by kauserali on 22/01/16.
 */
'use strict';

var server = require('../bin/www');
var OAuth2Server = require('oauth2-server');
var Authorize = require('oauth2-server/lib/authorise')
var sinon = require('sinon');
var superagent = require('superagent');
var expect = require('chai').expect;

var scheme = 'http://';
var host = '127.0.0.1';
var port = '3000';
var url = scheme + host + ':' + port;

describe('API test suite', function() {
    before(function() {
        console.log('Starting the server');

        sinon.stub(OAuth2Server.prototype, 'authorise', function() {
            return function (req, res, next) {
                return next();
            };
        });

        server.boot();
    });

    it('Retrieve all lists', function(done) {
        //send a request to list alll the lists
        superagent.get(url + '/lists').end(function(err, res) {
           expect(res.statusCode).to.equal(200);
            done();
        });
    });

    after(function() {
        console.log('Closing the server');
        server.shutdown();
    });
});

