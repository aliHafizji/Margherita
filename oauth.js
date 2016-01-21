/**
 * Created by kauserali on 20/01/16.
 */

var oauthserver = require('oauth2-server');
var server = oauthserver({
    model: require('./db/authorization.js'),
    grants: ['password'],
    accessTokenLifetime: null,
    debug: true
});

module.exports = server;