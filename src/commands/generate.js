
//import * as html from '../extensions/html-generate'

module.exports = {
  name: 'generate',
  alias: ['g'],
  run: async toolbox => {
    const {
      system,
      parameters,
      template: { generate },
      print: { info, error, success },
      strings,
    } = toolbox

    const checkPlural = (s) => {
      if(strings.pluralize.isPlural(s))
        //s = s.slice(0, -1) 
        s = strings.singular(s)
        return s
    };

    const delay = () => {
      return new Promise(resolve => setTimeout(resolve, 300));
    }

    const fs = require('fs');
    const mysql  = require('mysql');
    const name = strings.camelCase(checkPlural(parameters.first)).toLowerCase();
    const nameCapitalize = checkPlural(strings.upperFirst(name)); //name.charAt(0).toUpperCase() + strings.camelCase(name.slice(1))
    const table = parameters.first;
    let resultsQuery = [];
    let config = new Map();
    

    //====================================================================================================
    //==================================== FILE .ENV CONFIG MYSQL ===========================================
    //====================================================================================================
    try 
    {
    const env = fs.readFileSync('.env').toString().split("\n");
    if(env.length)
      env.map((item,index) => 
      {
        let [i, value] = item.split('=');
        if(['DB_CONNECTION','DB_HOST','DB_PORT','DB_DATABASE','DB_USERNAME','DB_PASSWORD'].indexOf(i) != -1)
        {
          config.set(i, value);
        }
      });
    }catch(e)
    {
      error(`Please create the .env file`);
      return false;
    }

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
        break;
    
      default:
        error(`Database in .env file not configured ['DB_CONNECTION','DB_HOST','DB_PORT','DB_DATABASE','DB_USERNAME','DB_PASSWORD']`);
        break;
    }

    //====================================================================================================
    //====================================================================================================
    //====================================================================================================

    //====================================================================================================
    //==================================== CONNECTION MYSQL ==============================================
    //====================================================================================================

    try 
    {
      let connection = mysql.createConnection({
        host     : config.get('DB_HOST'),
        user     : config.get('DB_USERNAME'),
        password : config.get('DB_PASSWORD'),
        database : config.get('DB_DATABASE')
      });
      
      connection.connect();
      //TEST CONNECTION
      await connection.query('DESCRIBE '+table, async function (errors, results, fields) {
        //if (errors) throw console.error(errors);
        if (errors) 
        { 
          error(`Mysql connection failed`);
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
      await delay();
      connection.end();
    }catch(e)
    {
      error(e);
      //error(`Mysql connection failed`);
      return false;
    }
    //====================================================================================================
    //====================================================================================================
    //====================================================================================================


    //console.log(JSON.stringify(resultsQuery[0]));

    //====================================================================================================
    //==================================== GENERATE HTML =================================================
    //====================================================================================================

    await generate({
      template: 'model.js.ejs',
      target: `app/Http/${nameCapitalize}.php`,
      props: { nameCapitalize }
    });

    info(`Generated file at app/Http/${nameCapitalize}.php`);

    await generate({
      template: 'controller.js.ejs',
      target: `app/Http/Controllers/Controle/${nameCapitalize}Controller.php`,
      props: { nameCapitalize, name }
    });

    info(`Generated file app/Http/Controllers/Controle/${nameCapitalize}Controller.php`);

    await generate({
      template: 'index.js.ejs',
      target: `resources/views/controle/${name}/index.blade.php`,
      props: { nameCapitalize, name, resultsQuery }
    });

    info(`Generated file resources/views/controle/${name}/index.blade.php`);

    await generate({
      template: 'form.js.ejs',
      target: `resources/views/controle/${name}/form.blade.php`,
      props: { nameCapitalize, name, resultsQuery },
      rmWhitespace:true,
    });

    info(`Generated file resources/views/controle/${name}/form.blade.php`);

    //====================================================================================================
    //====================================================================================================
    //====================================================================================================
  }
}

