var database = require('pg');
var connectionString = process.env.DATABASE_URL

module.exports.database = database;
module.exports.connectionString = connectionString;
