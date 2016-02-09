var database = require('pg');
var connectionString = process.env.DATABASE_URL | "postgres://127.0.0.1:5432/margherita";

module.exports.database = database;
module.exports.connectionString = connectionString;
