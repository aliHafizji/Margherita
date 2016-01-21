"use strict";

var database = require('./database.js').database;
var connectionString = require('./database.js').connectionString;

class User {

  static getAccessToken(bearerToken, callback) {
    database.connect(connectionString, function (err, client, done) {
      if (err) return callback(err);

      client.query('SELECT access_token, client_id, expires, user_id FROM oauth_access_tokens ' +
          'WHERE access_token = $1', [bearerToken], function (err, result) {
        if (err || !result.rowCount) return callback(err);

        var token = result.rows[0];
        callback(null, {
          accessToken: token.access_token,
          clientId: token.client_id,
          expires: token.expires,
          userId: token.user_id
        });
        done();
      });
    });
  };

  static getClient(clientId, clientSecret, callback) {
    database.connect(connectionString, function (err, client, done) {
      if (err) return callback(err);

      client.query('SELECT client_id, client_secret, redirect_uri FROM oauth_clients WHERE client_id = $1', [clientId], function (err, result) {
        if (err || !result.rowCount) return callback(err);

        var client = result.rows[0];

        if (clientSecret !== null && client.client_secret !== clientSecret) return callback();

        callback(null, {
          clientId: client.client_id,
          clientSecret: client.client_secret
        });
        done();
      });
    });
  };

  static grantTypeAllowed(clientId, grantType, callback) {
    database.connect(connectionString, function(err, client, done) {
       if (err) return callback(err, false);

       client.query('SELECT grant_type from oauth_clients where client_id = $1', [clientId], function(err, result) {
           if (err || !result.rowCount) return callback(err, false);

           callback(false, result.rows[0].grant_type === grantType);
       });
    });
  };

  static getRefreshToken(bearerToken, callback) {
    database.connect(connectionString, function (err, client, done) {
      if (err) return callback(err);
      client.query('SELECT refresh_token, client_id, expires, user_id FROM oauth_refresh_tokens ' +
          'WHERE refresh_token = $1', [bearerToken], function (err, result) {

        callback(err, result.rowCount ? result.rows[0] : false);
        done();
      });
    });
  };

  static saveAccessToken(accessToken, clientId, expires, userId, callback) {
    database.connect(connectionString, function (err, client, done) {
      if (err) return callback(err);
      client.query('INSERT INTO oauth_access_tokens(access_token, client_id, user_id, expires) VALUES ($1, $2, $3, $4)', [accessToken, clientId, userId, expires], function (err, result) {
        callback(err);
        done();
      });
    });
  };

  static saveRefreshToken(refreshToken, clientId, expires, userId, callback) {
    database.connect(connectionString, function (err, client, done) {
      if (err) return callback(err);
      client.query('INSERT INTO oauth_refresh_tokens(refresh_token, client_id, user_id, expires) VALUES ($1, $2, $3, $4)', [refreshToken, clientId, userId, expires], function (err, result) {
        callback(err);
        done();
      });
    });
  };

  static getUser(username, password, callback) {
    database.connect(connectionString, function (err, client, done) {
      if (err) return callback(err);
      client.query('SELECT id FROM users WHERE username = $1 AND password = $2', [username, password], function (err, result) {
        callback(err, result.rowCount ? result.rows[0].id : false);
        done();
      });
    });
  };
}

module.exports.getAccessToken = User.getAccessToken;
module.exports.getClient = User.getClient;
module.exports.grantTypeAllowed = User.grantTypeAllowed;
module.exports.getRefreshToken = User.getRefreshToken;
module.exports.saveAccessToken = User.saveAccessToken;
module.exports.saveRefreshToken = User.saveRefreshToken;
module.exports.getUser = User.getUser;
