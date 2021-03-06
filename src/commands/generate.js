
//import * as html from '/extensions/html-generate'

module.exports = {
  name: 'generate',
  alias: ['g'],
  run: async toolbox => {
    const {
      //system,
      parameters,
      template: { generate },
      print: { info, error, success },
      strings
      // filesystem,
      // template,
      // patching
    } = toolbox

    const checkPlural = (s) => {
      if (strings.pluralize.isPlural(s))
        s = s.slice(0, -1)
      //s = strings.singular(s)
      return s
    };

    const fs = require('fs');
    //const mysql  = require('mysql');
    const name = strings.camelCase(checkPlural(parameters.first)).toLowerCase();
    const nameCapitalize = checkPlural(strings.upperFirst(strings.camelCase(parameters.first))); //name.charAt(0).toUpperCase() + strings.camelCase(name.slice(1))
    const table = parameters.first;
    let resultsQuery = [];
    //let config = new Map();


    let space = parameters.second;
    if (!space) {
      info(`grao g table_name namespace`);
      error(`Please pass the namespace`);
      return false;
    }
    space = space.toLowerCase();
    //====================================================================================================
    //==================================== FILE .ENV CONFIG MYSQL ===========================================
    //====================================================================================================
    let config = await toolbox.getEnv();
    if (!config) {
      return false;
    }

    //====================================================================================================
    //====================================================================================================
    //====================================================================================================

    //====================================================================================================
    //========================================= VIEW CONFIG ==============================================
    //====================================================================================================

    let dir = './grao-config';
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
      fs.readFile(__dirname + '/../templates/index.js.ejs', function (err, data) {
        if (err) {
          throw err;
        }
        fs.writeFile('./grao-config/index.js.ejs', data, function (err, data) {
          if (err) {
            throw err;
          }
        });
      });
      fs.readFile(__dirname + '/../templates/edit.js.ejs', function (err, data) {
        if (err) {
          throw err;
        }
        fs.writeFile('./grao-config/edit.js.ejs', data, function (err, data) {
          if (err) {
            throw err;
          }
        });
      });

      fs.readFile(__dirname + '/../templates/show.js.ejs', function (err, data) {
        if (err) {
          throw err;
        }
        fs.writeFile('./grao-config/show.js.ejs', data, function (err, data) {
          if (err) {
            throw err;
          }
        });
      });

      fs.readFile(__dirname + '/../templates/controller.js.ejs', function (err, data) {
        if (err) {
          throw err;
        }
        fs.writeFile('./grao-config/controller.js.ejs', data, function (err, data) {
          if (err) {
            throw err;
          }
        });
      });

      fs.readFile(__dirname + '/../templates/model.js.ejs', function (err, data) {
        if (err) {
          throw err;
        }
        fs.writeFile('./grao-config/model.js.ejs', data, function (err, data) {
          if (err) {
            throw err;
          }
        });
      });
      fs.writeFile('./grao-config/routes.php', '<?php ' + toolbox.filesystem.eol, function (err, data) {
        if (err) {
          throw err;
        }
      });

      let path = '{'+toolbox.filesystem.eol+'\
      "model":"app", '+toolbox.filesystem.eol+'\
      "views":"resources/views" '+toolbox.filesystem.eol+'\
      }';
      fs.writeFile('./grao-config/path.config.json', path, function (err, data) {
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

    resultsQuery = await toolbox.mysqlConnection(table, config.get('DB_HOST'), config.get('DB_USERNAME'), config.get('DB_PASSWORD'), config.get('DB_DATABASE'), config.get('DB_PORT'));
    if (!resultsQuery) {
      return false;
    }

    // try 
    // {

    //   let connection = await mysql.createConnection({
    //     host     : config.get('DB_HOST'),
    //     user     : config.get('DB_USERNAME'),
    //     password : config.get('DB_PASSWORD'),
    //     database : config.get('DB_DATABASE')
    //   });

    //   await connection.connect();
    //   //TEST CONNECTION
    //   await connection.query('DESCRIBE ' + table, async function (errors, results, fields) {
    //     //if (errors) throw console.error(errors);
    //     if (errors) 
    //     { 
    //       error(`Mysql connection failed` + JSON.stringify(errors));
    //       return false;
    //     }
    //     success(`Successful Mysql Connection DESCRIBE `+table);
    //     //console.log(results);
    //     if(results.length)
    //     {
    //       await results.forEach(async (item,i) => 
    //       { 
    //         //console.log(item)
    //         resultsQuery[strings.trim(i)] = item;
    //       });
    //     }
    //   });
    //   await delay();
    //   await delay();
    //   resultsQuery = resultsQuery.splice(1,resultsQuery.length);
    //   connection.end();
    // }catch(e)
    // {
    //   error(e);
    //   //error(`Mysql connection failed`);
    //   return false;
    // }
    //====================================================================================================
    //====================================================================================================
    //====================================================================================================


    //====================================================================================================
    //==================================== GENERATE HTML =================================================
    //====================================================================================================

    let spaceFirst = strings.upperFirst(space);

    try{
      var pathConfig = fs.readFileSync(dir +'/path.config.json').toString();
      pathConfig = JSON.parse(pathConfig);    
      var nameModelSpace =  strings.upperFirst(pathConfig.model.replace('/','\\'));
    }catch(e){
      error('File path.config.json not found!')
      //return false;
    }

    if (!fs.existsSync(dir + '/model.js.ejs')) {
      await generate({
        template: 'model.js.ejs',
        target: `app/${nameCapitalize}.php`,
        props: { nameCapitalize, name, resultsQuery, nameModelSpace, strings }
      });
    } else {

      if(pathConfig.model)
      {
        await generate({
          template: 'model.js.ejs',
          target: `${pathConfig.model}/${nameCapitalize}.php`,
          props: { nameCapitalize, name, resultsQuery, space, nameModelSpace, strings },
          directory: './grao-config/'
        });
      }else{
        await generate({
          template: 'model.js.ejs',
          target: `app/${nameCapitalize}.php`,
          props: { nameCapitalize, name, resultsQuery, space, spaceFirst, strings },
          directory: './grao-config/'
        });
      }
    }

    success(`Generated file at app/${nameCapitalize}.php`);

    if (!fs.existsSync(dir + '/controller.js.ejs')) {
      await generate({
        template: 'controller.js.ejs',
        target: `app/Http/Controllers/${spaceFirst}/${nameCapitalize}Controller.php`,
        props: { nameCapitalize, name, spaceFirst, resultsQuery, space, nameModelSpace, strings, checkPlural }
      });
    } else {
      await generate({
        template: 'controller.js.ejs',
        target: `app/Http/Controllers/${spaceFirst}/${nameCapitalize}Controller.php`,
        props: { nameCapitalize, name, resultsQuery, spaceFirst, space, nameModelSpace, strings, checkPlural },
        directory: './grao-config/'
      });
    }

    success(`Generated file app/Http/Controllers/${spaceFirst}/${nameCapitalize}Controller.php`);


    if (!fs.existsSync(dir + '/index.js.ejs')) {
      await generate({
        template: 'index.js.ejs',
        target: `resources/views/${space}/${name}/index.blade.php`,
        props: { nameCapitalize, name, resultsQuery, space, spaceFirst }
      });
    } else {
      if(pathConfig.views)
      {
        await generate({
          template: 'index.js.ejs',
          target: `${pathConfig.views}/${space}/${name}/index.blade.php`,
          props: { nameCapitalize, name, resultsQuery, space, spaceFirst },
          directory: './grao-config/'
        });
      }else{
        await generate({
          template: 'index.js.ejs',
          target: `resources/views/${space}/${name}/index.blade.php`,
          props: { nameCapitalize, name, resultsQuery, space, spaceFirst },
          directory: './grao-config/'
        });
      }
    }

    success(`Generated file resources/views/${space}/${name}/index.blade.php`);

    if (!fs.existsSync(dir + '/edit.js.ejs')) {
      await generate({
        template: 'edit.js.ejs',
        target: `resources/views/${space}/${name}/edit.blade.php`,
        props: { nameCapitalize, name, resultsQuery, space }
      });
    } else {
      if(pathConfig.views)
      {
        await generate({
          template: 'edit.js.ejs',
          target: `${pathConfig.views}/${space}/${name}/edit.blade.php`,
          props: { nameCapitalize, name, resultsQuery, space },
          directory: './grao-config/'
        });
      }else{
        await generate({
          template: 'edit.js.ejs',
          target: `resources/views/${space}/${name}/edit.blade.php`,
          props: { nameCapitalize, name, resultsQuery, space },
          directory: './grao-config/'
        });
      }
    }

    success(`Generated file resources/views/${space}/${name}/edit.blade.php`);

    if (!fs.existsSync(dir + '/show.js.ejs')) {
      await generate({
        template: 'show.js.ejs',
        target: `resources/views/${space}/${name}/show.blade.php`,
        props: { nameCapitalize, name, resultsQuery, space }
      });
    } else {
      if(pathConfig.views)
      {
        await generate({
          template: 'show.js.ejs',
          target: `${pathConfig.views}/${space}/${name}/show.blade.php`,
          props: { nameCapitalize, name, resultsQuery, space },
          directory: './grao-config/'
        });
      }else{
        await generate({
          template: 'show.js.ejs',
          target: `resources/views/${space}/${name}/show.blade.php`,
          props: { nameCapitalize, name, resultsQuery, space },
          directory: './grao-config/'
        });
      }
    }

    success(`Generated file resources/views/${space}/${name}/show.blade.php`);


    // let route = "" + toolbox.filesystem.eol + " //========================== " + name + " ================================ " + toolbox.filesystem.eol + "\
    //   Route::get('"+ name + "', [" + toolbox.filesystem.eol + " \
    //     'as'   => '"+ space + "." + name + ".index'," + toolbox.filesystem.eol + " \
    //     'permissao' => '"+ space + "." + name + ".index'," + toolbox.filesystem.eol + " \
    //     'uses' => '"+ strings.upperFirst(space) + "\\" + nameCapitalize + "Controller@index'," + toolbox.filesystem.eol + " \
    //   ]);"+ toolbox.filesystem.eol + " \
    //   Route::get('"+ name + "/form/{id?}', [" + toolbox.filesystem.eol + " \
    //     'as'   => '"+ space + "." + name + ".form'," + toolbox.filesystem.eol + " \
    //     'permissao' => '"+ space + "." + name + ".form'," + toolbox.filesystem.eol + " \
    //     'uses' => '"+ strings.upperFirst(space) + "\\" + nameCapitalize + "Controller@form'," + toolbox.filesystem.eol + " \
    //   ]);"+ toolbox.filesystem.eol + " \
    //   Route::post('"+ name + "/create', [" + toolbox.filesystem.eol + " \
    //     'as'   => '"+ space + "." + name + ".create'," + toolbox.filesystem.eol + " \
    //     'permissao' => '"+ space + "." + name + ".create'," + toolbox.filesystem.eol + " \
    //     'uses' => '"+ strings.upperFirst(space) + "\\" + nameCapitalize + "Controller@create'," + toolbox.filesystem.eol + " \
    //   ]);"+ toolbox.filesystem.eol + " \
    //   Route::post('"+ name + "/update/{id}', [" + toolbox.filesystem.eol + " \
    //     'as'   => '"+ space + "." + name + ".update'," + toolbox.filesystem.eol + " \
    //     'permissao' => '"+ space + "." + name + ".update'," + toolbox.filesystem.eol + " \
    //     'uses' => '"+ strings.upperFirst(space) + "\\" + nameCapitalize + "Controller@update'," + toolbox.filesystem.eol + " \
    //   ]);"+ toolbox.filesystem.eol + " \
    //   Route::get('"+ name + "/destroy/{id}', [" + toolbox.filesystem.eol + " \
    //     'as'   => '"+ space + "." + name + ".destroy'," + toolbox.filesystem.eol + " \
    //     'permissao' => '"+ space + "." + name + ".destroy'," + toolbox.filesystem.eol + " \
    //     'uses' => '"+ strings.upperFirst(space) + "\\" + nameCapitalize + "Controller@destroy'," + toolbox.filesystem.eol + " \
    //   ]);";

    let route = "" + toolbox.filesystem.eol + " //========================== " + name + " ================================ " + toolbox.filesystem.eol + "\
    //API "+ toolbox.filesystem.eol + " \
    //Route::resource('/"+name+"', '"+nameCapitalize+"Controller');"+ toolbox.filesystem.eol + " \
    //OR "+ toolbox.filesystem.eol + " \
    Route::get('"+ name + "', ['uses' => '"+ strings.upperFirst(space) + "\\" + nameCapitalize + "Controller@index'])->name('"+ space + "." + name + ".index'); "+ toolbox.filesystem.eol + " \
    Route::get('"+ name + "/create', ['uses' => '"+ strings.upperFirst(space) + "\\" + nameCapitalize + "Controller@create'])->name('"+ space + "." + name + ".create'); "+ toolbox.filesystem.eol + " \
    Route::get('"+ name + "/show/{id}', ['uses' => '"+ strings.upperFirst(space) + "\\" + nameCapitalize + "Controller@show'])->name('"+ space + "." + name + ".show'); "+ toolbox.filesystem.eol + " \
    Route::get('"+ name + "/edit/{id}', ['uses' => '"+ strings.upperFirst(space) + "\\" + nameCapitalize + "Controller@edit'])->name('"+ space + "." + name + ".edit'); "+ toolbox.filesystem.eol + " \
    Route::post('"+ name + "/store', ['uses' => '"+ strings.upperFirst(space) + "\\" + nameCapitalize + "Controller@store'])->name('"+ space + "." + name + ".store'); "+ toolbox.filesystem.eol + " \
    Route::post('"+ name + "/update/{id}', ['uses' => '"+ strings.upperFirst(space) + "\\" + nameCapitalize + "Controller@update'])->name('"+ space + "." + name + ".update'); "+ toolbox.filesystem.eol + "\
    Route::get('"+ name + "/delete/{id}', ['uses' => '"+ strings.upperFirst(space) + "\\" + nameCapitalize + "Controller@destroy'])->name('"+ space + "." + name + ".destroy'); "+ toolbox.filesystem.eol + " \
    ";



    fs.appendFile('./grao-config/routes.php', route, function (err) {
      if (err) throw err;
      //console.log('Updated!');
      info(`Update file routes /grao-config/routes.php`);
    });


    info(`Await ... composer dumpautoload `);
    let cmdResult = await toolbox.system.run('composer dumpautoload', { trim: true });
    info(cmdResult);

    //====================================================================================================
    //====================================================================================================
    //====================================================================================================
  }
}

