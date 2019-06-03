
// add your CLI-specific functionality here, which will then be accessible
// to your commands
module.exports = toolbox => {

  const {
    print: { info, error, success },
    strings,
  } = toolbox

  const mysql  = require('mysql');
  const fs = require('fs');
  let config = new Map();

  toolbox.foo = () => {
    toolbox.print.info('called foo extension')
  }

  toolbox.delay = () => {
    return new Promise(resolve => setTimeout(resolve, 300));
  }

  toolbox.mysqlConnection =  async (table, db_host,db_username,db_pass, db_database) => {
    try 
    {
      let resultsQuery = [];
      let connection = await mysql.createConnection({
        host     : db_host,
        user     : db_username,
        password : db_pass,
        database : db_database
      });
      
      await connection.connect();
      //TEST CONNECTION
      await connection.query('DESCRIBE ' + table, async function (errors, results, fields) {
        //if (errors) throw console.error(errors);
        if (errors) 
        { 
          error(`Mysql connection failed` + JSON.stringify(errors));
          return false;
        }
        success(`Successful Mysql Connection DESCRIBE `+table);
        //console.log(results);
        if(results.length)
        {
          await results.forEach(async (item,i) => 
          { 
            //console.log(item)
            resultsQuery[strings.trim(i)] = item;
          });
        }
      });
      await toolbox.delay();
      await toolbox.delay();
      resultsQuery = resultsQuery.splice(1,resultsQuery.length);
      connection.end();
      return resultsQuery;
    }catch(e)
    {
      error(e);
      //error(`Mysql connection failed`);
      return false;
    }
  }

  toolbox.getEnv = async () => {
    try 
    {
    const env = fs.readFileSync('.env').toString().split(toolbox.filesystem.eol);
    if(env.length)
      env.map((item,index) => 
      {
        let [i, value] = item.split('=');
        if(['DB_CONNECTION','DB_HOST','DB_PORT','DB_DATABASE','DB_USERNAME','DB_PASSWORD'].indexOf(i) != -1)
        {
          config.set(i, strings.trim(value));
        }
      });
    }catch(e)
    {
      error(`Please create the .env file`);
      return false;
    }

    await toolbox.delay();
    
    if(config.get('DB_CONNECTION') != 'mysql')
    {
      error(`Database mysql in .env file not configured ['DB_CONNECTION']`);
      return false; 
    }

    switch (true) 
    {
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
