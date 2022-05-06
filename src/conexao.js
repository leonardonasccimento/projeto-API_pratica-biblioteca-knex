const knex = require('knex')({
    client: 'pg',
    connection: {
      host : 'localhost',
      port : 5432,
      user : 'postgres',
      database: 'market_cubos',
      password : 'postgres'
    }
});

module.exports = knex;

