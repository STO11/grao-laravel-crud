
module.exports = {
  name: 'generate',
  alias: ['g'],
  run: async toolbox => {
    const {
      system,
      parameters,
      template: { generate },
      print: { info, error, success },
      strings
    } = toolbox


    const toCamel = (s) => {
      return s.replace(/([-_][a-z])/ig, ($1) => {
        return $1.toUpperCase()
          .replace('-', '')
          .replace('_', '');
      });
    };

    const checkPlural = (s) => {
      if(s.charAt(s.length - 1) == 's')
        s = s.slice(0, -1) 
        return s
    };

    const fs = require('fs');
    const mysql  = require('mysql');
    const name = toCamel(checkPlural(parameters.first));
    const nameCapitalize = toCamel(checkPlural(name.charAt(0).toUpperCase() + name.slice(1)));
    const table = parameters.first;
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
      connection.query('DESCRIBE '+table, function (errors, results, fields) {
        //if (errors) throw console.error(errors);
        if (errors) 
        { 
          error(`Mysql connection failed`);
          return false;
        }
        success(`Successful Mysql Connection DESCRIBE `+table);
      });
      
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
      props: { nameCapitalize, name }
    });

    info(`Generated file resources/views/controle/${name}/index.blade.php`);

    await generate({
      template: 'form.js.ejs',
      target: `resources/views/controle/${name}/form.blade.php`,
      props: { nameCapitalize, name }
    });

    info(`Generated file resources/views/controle/${name}/form.blade.php`)
  }
}
