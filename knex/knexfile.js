// Update with your config settings.

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
 module.exports = {
    testing: {
      client: 'pg',
      connection: {
        host: process.env.PGHOST,
        database: process.env.PGDATABASE,
        user: process.env.PGUSER,
        password: process.env.PGPASSWORD
      },
      migrations: {
        directory: __dirname + '/knex/migrations',
      },
      seeds : {
        directory: __dirname + '/knex/seeds',
      }
    }
  
  };
  