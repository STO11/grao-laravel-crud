
//import * as html from '/extensions/html-generate'

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
      filesystem,
      template,
      patching
    } = toolbox

    const checkPlural = (s) => {
      if(strings.pluralize.isPlural(s))
        s = s.slice(0, -1) 
        //s = strings.singular(s)
        return s
    };

    const delay = () => {
      return new Promise(resolve => setTimeout(resolve, 300));
    }

    const fs = require('fs');
    const mysql  = require('mysql');
    const name = strings.camelCase(checkPlural(parameters.first)).toLowerCase();
    const nameCapitalize = checkPlural(strings.upperFirst(strings.camelCase(parameters.first))); //name.charAt(0).toUpperCase() + strings.camelCase(name.slice(1))
    const table = parameters.first;
    let resultsQuery = [];
    let config = new Map();
    //const path = require('path').basename(__dirname);

    //console.log(__dirname);

    //return false;
    
    //====================================================================================================
    //==================================== FILE .ENV CONFIG MYSQL ===========================================
    //====================================================================================================
    try 
    {
    const env = fs.readFileSync('.env').toString().split(toolbox.filesystem.eol);
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
    //========================================= VIEW CONFIG ==============================================
    //====================================================================================================

    // try 
    // {
    //   const env = fs.readFileSync('').toString().split("\n");
    //   if(!env.length)
    //   {
    //     await generate({
    //       template: 'model.js.ejs',
    //       target: `app/Http/${nameCapitalize}.php`,
    //       props: { nameCapitalize }
    //     });
    //   } 
    // }catch(e)
    // {
    //   error(`Please create the .env file`);
    //   return false;
    // }

    let dir = './grao-config';
    if (!fs.existsSync(dir))
    {
      fs.mkdirSync(dir);
      fs.readFile(__dirname+'/../templates/index.js.ejs', function(err, data) {
        if (err) {
          throw err;
        }
        fs.writeFile('./grao-config/index.js.ejs', data,function(err, data) {
          if (err) {
            throw err;
          }
        });
      });
      fs.readFile(__dirname+'/../src/templates/form.js.ejs', function(err, data) {
        if (err) {
          throw err;
        }
        fs.writeFile('./grao-config/form.js.ejs', data,function(err, data) {
          if (err) {
            throw err;
          }
        });
      });
      fs.writeFile('./grao-config/routes.php', '<?php '+toolbox.filesystem.eol,function(err, data) {
        if (err) {
          throw err;
        }
      });
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
      resultsQuery = resultsQuery.splice(1,resultsQuery.length);
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


    //====================================================================================================
    //==================================== GENERATE HTML =================================================
    //====================================================================================================

    await generate({
      template: 'model.js.ejs',
      target: `app/Http/${nameCapitalize}.php`,
      props: { nameCapitalize, name, resultsQuery }
    });

    info(`Generated file at app/Http/${nameCapitalize}.php`);

    await generate({
      template: 'controller.js.ejs',
      target: `app/Http/Controllers/Controle/${nameCapitalize}Controller.php`,
      props: { nameCapitalize, name }
    });

    info(`Generated file app/Http/Controllers/Controle/${nameCapitalize}Controller.php`);


    if (!fs.existsSync(dir+'/index.js.ejs'))
    {
      await generate({
        template: 'index.js.ejs',
        target: `resources/views/controle/${name}/index.blade.php`,
        props: { nameCapitalize, name, resultsQuery }
      });
    }else{
      await generate({
        template: '../../grao-config/index.js.ejs',
        target: `resources/views/controle/${name}/index.blade.php`,
        props: { nameCapitalize, name, resultsQuery }
      });
    }

    info(`Generated file resources/views/controle/${name}/index.blade.php`);

    if (!fs.existsSync(dir+'/index.js.ejs'))
    {
      await generate({
        template: 'form.js.ejs',
        target: `resources/views/controle/${name}/form.blade.php`,
        props: { nameCapitalize, name, resultsQuery }
      });
    }else{
      await generate({
        template: '../../grao-config/form.js.ejs',
        target: `resources/views/controle/${name}/form.blade.php`,
        props: { nameCapitalize, name, resultsQuery }
      });
    }

    info(`Generated file resources/views/controle/${name}/form.blade.php`);

  
    let route = "\r\r //========================== "+name+" ================================ \r\r \
      Route::get('"+name+"', [\r \
        'as'   => 'controle."+name+".index',\r \
        'permissao' => 'controle."+name+".index',\r \
        'uses' => 'Controle\\"+nameCapitalize+"Controller@index',\r \
      ]);\r \
      Route::get('"+name+"/form/{id?}', [\r \
        'as'   => 'controle."+name+".form',\r \
        'permissao' => 'controle."+name+".form',\r \
        'uses' => 'Controle\\"+nameCapitalize+"Controller@form',\r \
      ]);\r \
      Route::post('"+name+"/create', [\r \
        'as'   => 'controle."+name+".create',\r \
        'permissao' => 'controle."+name+".create',\r \
        'uses' => 'Controle\\"+nameCapitalize+"Controller@create',\r \
      ]);\r \
      Route::post('"+name+"/update/{id}', [\r \
        'as'   => 'controle."+name+".update',\r \
        'permissao' => 'controle."+name+".update',\r \
        'uses' => 'Controle\\"+nameCapitalize+"Controller@update',\r \
      ]);\r \
      Route::get('"+name+"/destroy/{id}', [\r \
        'as'   => 'controle."+name+".destroy',\r \
        'permissao' => 'controle."+name+".destroy',\r \
        'uses' => 'Controle\\"+nameCapitalize+"Controller@destroy',\r \
      ]);";

    fs.appendFile('./grao-config/routes.php', route, function (err) {
      if (err) throw err;
      //console.log('Updated!');
      info(`Update file routes /grao-config/routes.php`);
    });
  

    //====================================================================================================
    //====================================================================================================
    //====================================================================================================
  }
}

