
// add your CLI-specific functionality here, which will then be accessible
// to your commands
module.exports = toolbox => {

  const {
    print: { info, error, success },
    strings,
  } = toolbox

  const mysql = require('mysql');
  const fs = require('fs');
  let config = new Map();

  toolbox.foo = () => {
    toolbox.print.info('called foo extension')
  }

  toolbox.delay = () => {
    return new Promise(resolve => setTimeout(resolve, 300));
  }

  toolbox.mysqlConnection = async (table, db_host, db_username, db_pass, db_database, db_port) => {
    try {
      let resultsQuery = [];
      let connection = await mysql.createConnection({
        host: db_host,
        user: db_username,
        password: db_pass,
        database: db_database,
        port: db_port
      });

      await connection.connect();
      //TEST CONNECTION
      await connection.query('DESCRIBE ' + table, async function (errors, results, fields) {
        //if (errors) throw console.error(errors);
        if (errors) {
          error(`Mysql connection failed` + JSON.stringify(errors));
          return false;
        }
        success(`Successful Mysql Connection DESCRIBE ` + table);
        //console.log(results);
        if (results.length) {
          await results.forEach(async (item, i) => {
            //console.log(item)
            resultsQuery[strings.trim(i)] = item;
          });
        }
      });
      await toolbox.delay();
      await toolbox.delay();
      resultsQuery = resultsQuery.splice(1, resultsQuery.length);
      connection.end();
      return resultsQuery;
    } catch (e) {
      error(e);
      //error(`Mysql connection failed`);
      return false;
    }
  }

  toolbox.mysqlQuery = async (query, db_host, db_username, db_pass, db_database, db_port) => {
    return new Promise(async (_success, _reject) => {
      try {
        let resultsQuery = [];
        let connection = await mysql.createConnection({
          host: db_host,
          user: db_username,
          password: db_pass,
          database: db_database,
          port: db_port
        });

        await connection.connect();

        await connection.query(query, async function (errors, results, fields) {
          if (errors) {
            _reject(`Mysql connection failed` + JSON.stringify(errors));
            return false;
          }
          if (results.length) {
            await results.forEach(async (item, i) => {
              resultsQuery[strings.trim(i)] = item;
            });
          }
        });
        await toolbox.delay();
        await toolbox.delay();
        _success(resultsQuery);
        connection.end();
      } catch (e) {
        error(e);
        _reject(resultsQuery);
        //error(`Mysql connection failed`);
        return false;
      }
    });
  }


  toolbox.getEnv = async () => {
    try {

      const env = require('dotenv').config();

      await config.set('DB_CONNECTION', strings.trim(env.parsed.DB_CONNECTION));
      await config.set('DB_HOST', strings.trim(env.parsed.DB_HOST));
      await config.set('DB_PORT', strings.trim(env.parsed.DB_PORT));
      await config.set('DB_DATABASE', strings.trim(env.parsed.DB_DATABASE));
      await config.set('DB_USERNAME', strings.trim(env.parsed.DB_USERNAME));
      await config.set('DB_PASSWORD', strings.trim(env.parsed.DB_PASSWORD));

      // const env = fs.readFileSync('.env').toString().split(toolbox.filesystem.eol);
      // if (env.length)
      //   await env.map(async (item, index) => {
      //     let [i, value] = item.split('=');
      //     if (['DB_CONNECTION', 'DB_HOST', 'DB_PORT', 'DB_DATABASE', 'DB_USERNAME', 'DB_PASSWORD'].indexOf(i) != -1) {
      //       await config.set(i, strings.trim(value));
      //     }
      //   });
    } catch (e) {
      error(`Please create the .env file`);
      return false;
    }

    await toolbox.delay();
    await toolbox.delay();
    await toolbox.delay();
    await toolbox.delay();

    if (config.get('DB_CONNECTION') != 'mysql') {
      error(`Database mysql in .env file not configured ['DB_CONNECTION']`);
      return false;
    }

    switch (true) {
      case config.has('DB_CONNECTION'):
      case config.has('DB_HOST'):
      case config.has('DB_PORT'):
      case config.has('DB_DATABASE'):
      case config.has('DB_USERNAME'):
      case config.has('DB_PASSWORD'):
        //console.log('ok')

        return config;
        break;

      default:
        error(`Database in .env file not configured ['DB_CONNECTION','DB_HOST','DB_PORT','DB_DATABASE','DB_USERNAME','DB_PASSWORD']`);
        return false;
        break;
    }
  }

  // enable this if you want to read configuration in from
  // the current folder's package.json (in a "grao" property),
  // grao.config.json, etc.
  // toolbox.config = {
  //   ...toolbox.config,
  //   ...toolbox.config.loadConfig(process.cwd(), "grao")
  // }
}
