
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
    
    let space = parameters.second;
    if(!space)
    {
      info(`grao g table_name namespace`);
      error(`Please pass the namespace`);
      return false;
    }
    space = space.toLowerCase();
    //====================================================================================================
    //==================================== FILE .ENV CONFIG MYSQL ===========================================
    //====================================================================================================
    try 
    {
    const env = await fs.readFileSync('.env').toString().split(toolbox.filesystem.eol);
    if(env.length)
      await env.map((item,index) => 
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

    await delay(500);
    
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
      fs.readFile(__dirname+'/../templates/form.js.ejs', function(err, data) {
        if (err) {
          throw err;
        }
        fs.writeFile('./grao-config/form.js.ejs', data,function(err, data) {
          if (err) {
            throw err;
          }
        });
      });

      fs.readFile(__dirname+'/../templates/controller.js.ejs', function(err, data) {
        if (err) {
          throw err;
        }
        fs.writeFile('./grao-config/controller.js.ejs', data,function(err, data) {
          if (err) {
            throw err;
          }
        });
      });

      fs.readFile(__dirname+'/../templates/model.js.ejs', function(err, data) {
        if (err) {
          throw err;
        }
        fs.writeFile('./grao-config/model.js.ejs', data,function(err, data) {
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
      let connection = await mysql.createConnection({
        host     : config.get('DB_HOST'),
        user     : config.get('DB_USERNAME'),
        password : config.get('DB_PASSWORD'),
        database : config.get('DB_DATABASE')
      });
      
      await connection.connect();
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

    let spaceFirst = strings.upperFirst(space);

    if (!fs.existsSync(dir+'/model.js.ejs'))
    {
      await generate({
        template: 'model.js.ejs',
        target: `app/Http/${nameCapitalize}.php`,
        props: { nameCapitalize, name, resultsQuery }
      });
    }else{
      await generate({
        template: 'model.js.ejs',
        target: `app/Http/${nameCapitalize}.php`,
        props: { nameCapitalize, name, resultsQuery },
        directory: './grao-config/'
      });
    }

    success(`Generated file at app/Http/${nameCapitalize}.php`);

    if (!fs.existsSync(dir+'/controller.js.ejs'))
    {
      await generate({
        template: 'controller.js.ejs',
        target: `app/Http/Controllers/${spaceFirst}/${nameCapitalize}Controller.php`,
        props: { nameCapitalize, name, spaceFirst, resultsQuery, space }
      });
    }else{
      
      await generate({
        template: 'controller.js.ejs',
        target: `app/Http/Controllers/${spaceFirst}/${nameCapitalize}Controller.php`,
        props: { nameCapitalize, name, resultsQuery, spaceFirst, space },
        directory: './grao-config/'
      });
    }

    success(`Generated file app/Http/Controllers/${spaceFirst}/${nameCapitalize}Controller.php`);


    if (!fs.existsSync(dir+'/index.js.ejs'))
    {
      await generate({
        template: 'index.js.ejs',
        target: `resources/views/${space}/${name}/index.blade.php`,
        props: { nameCapitalize, name, resultsQuery, space }
      });
    }else{
      await generate({
        template: 'index.js.ejs',
        target: `resources/views/${space}/${name}/index.blade.php`,
        props: { nameCapitalize, name, resultsQuery, space },
        directory: './grao-config/'
      });
    }

    success(`Generated file resources/views/${space}/${name}/index.blade.php`);

    if (!fs.existsSync(dir+'/index.js.ejs'))
    {
      await generate({
        template: 'form.js.ejs',
        target: `resources/views/${space}/${name}/form.blade.php`,
        props: { nameCapitalize, name, resultsQuery, space }
      });
    }else{
      await generate({
        template: 'form.js.ejs',
        target: `resources/views/${space}/${name}/form.blade.php`,
        props: { nameCapitalize, name, resultsQuery, space },
        directory: './grao-config/'
      });
    }

    success(`Generated file resources/views/${space}/${name}/form.blade.php`);

  
    let route = ""+toolbox.filesystem.eol+" //========================== "+name+" ================================ "+toolbox.filesystem.eol+"\
      Route::get('"+name+"', ["+toolbox.filesystem.eol+" \
        'as'   => '"+space+"."+name+".index',"+toolbox.filesystem.eol+" \
        'permissao' => '"+space+"."+name+".index',"+toolbox.filesystem.eol+" \
        'uses' => '"+strings.upperFirst(space)+"\\"+nameCapitalize+"Controller@index',"+toolbox.filesystem.eol+" \
      ]);"+toolbox.filesystem.eol+" \
      Route::get('"+name+"/form/{id?}', ["+toolbox.filesystem.eol+" \
        'as'   => '"+space+"."+name+".form',"+toolbox.filesystem.eol+" \
        'permissao' => '"+space+"."+name+".form',"+toolbox.filesystem.eol+" \
        'uses' => '"+strings.upperFirst(space)+"\\"+nameCapitalize+"Controller@form',"+toolbox.filesystem.eol+" \
      ]);"+toolbox.filesystem.eol+" \
      Route::post('"+name+"/create', ["+toolbox.filesystem.eol+" \
        'as'   => '"+space+"."+name+".create',"+toolbox.filesystem.eol+" \
        'permissao' => '"+space+"."+name+".create',"+toolbox.filesystem.eol+" \
        'uses' => '"+strings.upperFirst(space)+"\\"+nameCapitalize+"Controller@create',"+toolbox.filesystem.eol+" \
      ]);"+toolbox.filesystem.eol+" \
      Route::post('"+name+"/update/{id}', ["+toolbox.filesystem.eol+" \
        'as'   => '"+space+"."+name+".update',"+toolbox.filesystem.eol+" \
        'permissao' => '"+space+"."+name+".update',"+toolbox.filesystem.eol+" \
        'uses' => '"+strings.upperFirst(space)+"\\"+nameCapitalize+"Controller@update',"+toolbox.filesystem.eol+" \
      ]);"+toolbox.filesystem.eol+" \
      Route::get('"+name+"/destroy/{id}', ["+toolbox.filesystem.eol+" \
        'as'   => '"+space+"."+name+".destroy',"+toolbox.filesystem.eol+" \
        'permissao' => '"+space+"."+name+".destroy',"+toolbox.filesystem.eol+" \
        'uses' => '"+strings.upperFirst(space)+"\\"+nameCapitalize+"Controller@destroy',"+toolbox.filesystem.eol+" \
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

