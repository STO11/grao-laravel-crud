
module.exports = {
  name: 'migrate',
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


    const fs = require('fs');
    const path = require('path');
    const table = parameters.first;
    const nameCapitalize = strings.upperFirst(strings.camelCase(parameters.first));
    const config = await toolbox.getEnv();

    // let results = await toolbox.mysqlConnection(table, config.get('DB_HOST'),config.get('DB_USERNAME'), config.get('DB_PASSWORD'), config.get('DB_DATABASE'));
    // if(!results)

    let dir = './composer.json';
    if (!fs.existsSync(dir))
    {
      error('The file composer.json not found.');
      return false;
    }

    const composer = fs.readFileSync('composer.json').toString();
    let composeData = JSON.parse(composer);
    if(!composeData.require['doctrine/dbal'])
    {
      const install = await toolbox.prompt.confirm('This command requires that laravel have the doctrine/dbal package, do you want to install it?');
      if(install)
      {
        info("Running the 'composer require doctrine/dbal' command please wait ...");
        let cmdResult = await toolbox.system.run('composer require doctrine/dbal', { trim: true });
        info(cmdResult);
        info("Run again grao migrate "+ table);

        if(!composeData.require['doctrine/dbal'])
        {
          return false;
        }

      }else{
        error('Require doctrine/dbal');
        return false;
      }
      return false;
    }

    const getAllFiles = dir =>
    fs.readdirSync(dir).reduce((files, file) => {
      //const name = path.join(dir, file);
      const name = path.join(dir, file);
      const isDirectory = fs.statSync(name).isDirectory();
      return isDirectory ? [...files, ...getAllFiles(name)] : [...files, name];
    }, []);

    if(parameters.options.run)
    {
      if(!table)
      {
        let files = await getAllFiles('./database/migrations/crudconfig/create');
        if(files)
        {
          files.map(async (path,i) => {
            let p = path.split('/');
            delete p[p.length - 1];
            path = p.join('/');
            toolbox.system.run(`php artisan migrate --path=${path}`, { trim: true })
            .then( async (dados) => {
                success(dados);
            });
          })
        }

        await toolbox.delay();
        await toolbox.delay();
        await toolbox.delay();
        await toolbox.delay();

        files = await getAllFiles('./database/migrations/crudconfig/update');
        if(files)
        {
          files.map(async (path,i) => {
            //console.log(path);
            let p = path.split('/');
            delete p[p.length - 1];
            path = p.join('/');
            //console.log(path)
            toolbox.system.run(`php artisan migrate --path=${path}`, { trim: true })
            .then((dados) => {
                success(dados);
            });      
          });
        }
      
        return true;
      }
    }

    if(parameters.options.rollback)
    {
      if(!table)
      {
        let files = await getAllFiles('./database/migrations/crudconfig/update');
        if(files)
        {
          files.sort().map(async (path,i) => {
            let p = path.split('/');
            delete p[p.length - 1];
            path = p.join('/');
            let migrateCreate = await toolbox.system.run(`php artisan migrate:rollback --path=${path}`, { trim: true })
            .then(async (dados) => {
              if(dados.match(/^Rolling back\:(.*)$/gm))
              {
                success(dados.match(/^Rolling back\:(.*)$/gm)[0]);
                success(dados.match(/^Rolled back\:(.*)$/gm)[0]);
              }
            });
           // await toolbox.delay();
            
          })
        }

        await toolbox.delay();
        await toolbox.delay();
        await toolbox.delay();
        await toolbox.delay();

        files = await getAllFiles('./database/migrations/crudconfig/create');
        if(files)
        {
          files.sort().map(async (path,i) => {
            let p = path.split('/');
            delete p[p.length - 1];
            path = p.join('/');
            toolbox.system.run(`php artisan migrate:rollback --path=${path}`, { trim: true })
            .then((dados) => {
              
              if(dados.match(/^Rolling back\:(.*)$/gm))
              {
                success(dados.match(/^Rolling back\:(.*)$/gm)[0]);
                success(dados.match(/^Rolled back\:(.*)$/gm)[0]);
              }
            });
            // await toolbox.delay();
          })
        }

       
        return true;
      }
    }

    if(parameters.options.run)
    {

      try{
        if(!table)
        { 
          error(`Not found parameter table Example: grao migrate update table_name`);
          return false;
        }
        //let migrateCreate = await 
          toolbox.system.run(`php artisan migrate --path=database/migrations/crudconfig/create/${table}`, { trim: true })
          .then((i) => {
            success(i)
           toolbox.system.run(`php artisan migrate --path=database/migrations/crudconfig/update/${table}`, { trim: true })
          .then((i) => {
            success(i)
          })
          .catch((e) => {
            //error('Check if table exist.');
            console.log(e);
          });

        })
        .catch((e) => {
          //error('Check if table exist.');
          console.log(e);
        });

       
        //console.log(migrateCreate);
      }catch(e)
      {
        console.log(e)
      }
      return true;
    }

    if(parameters.options.rollback)
    {
      if(!table)
      { 
        error(`Not found parameter table Example: grao migrate update table_name`);
        return false;
      }

      
      let files = await getAllFiles('./database/migrations/crudconfig/update');
      if(files)
      {
        files.sort().map(async (path,i) => {
          toolbox.system.run(`php artisan migrate:rollback --path=database/migrations/crudconfig/update/${table}`, { trim: true })
          .then( async (dados) => {
            if(dados.match(/^Rolling back\:(.*)$/gm))
            {
              success(dados.match(/^Rolling back\:(.*)$/gm)[0]);
              success(dados.match(/^Rolled back\:(.*)$/gm)[0]);  
            }
          });
        });
      }

      await toolbox.delay();
      await toolbox.delay();
      await toolbox.delay();
      await toolbox.delay();

      filesc = await getAllFiles('./database/migrations/crudconfig/create');
      if(filesc)
      {
          filesc.sort().map(async (path,i) => {
            toolbox.system.run(`php artisan migrate:rollback --path=database/migrations/crudconfig/create/${table}`, { trim: true })
            .then((dados) => {
              
              if(dados.match(/^Rolling back\:(.*)$/gm))
              {
                success(dados.match(/^Rolling back\:(.*)$/gm)[0]);
                success(dados.match(/^Rolled back\:(.*)$/gm)[0]);
              }
            });
          });
      }
      return true;
    }

    if(parameters.options.update)
    {

      if(!table)
      { 
        error(`Not found parameter table Example: grao migrate update table_name`);
        return false;
      }

      let migrateUpdate = await toolbox.system.run(`php artisan migrate:rollback --path=database/migrations/crudconfig/update/${table}`, { trim: true });
      migrateUpdate = await toolbox.system.run(`php artisan migrate --path=database/migrations/crudconfig/update/${table}`, { trim: true });
      success(migrateUpdate);
      
      return true;
    }


    if(!parameters.options.fields)
    {
      error('Parameter --fields not found in command. Example: > grao migrate table_name --fields={rel_id:bigInteger, nome:string,email:string}');
      return false;
    }

    let cmdMigration = [];
    let param = parameters.options.fields.split(',');
    if(param.length)
    {
      for(let i in param)
      {
        if(param[i].split(':').length)
        {
          let [field, type] = param[i].split(':');
          if(field && type)
          {
            cmdMigration[strings.trim(field)] = strings.trim(type);
          }
        }
      }
    }

    if(parameters.options.fks)
    {
      //error('Parameter --fks not found in command. ');
    }
    //console.log(cmdMigration);

    await toolbox.delay();

    const checkZeroLeft = (n) => {
        if(n < 10)
          return '0'+n;
        return n;
    }
    
    let dateObj = new Date();
    let month = checkZeroLeft(dateObj.getUTCMonth() + 1); //months from 1-12
    let day = checkZeroLeft(dateObj.getUTCDate());
    let year = dateObj.getUTCFullYear();

    let seconds = checkZeroLeft(dateObj.getSeconds());
    let minutes = checkZeroLeft(dateObj.getMinutes());
    let hour    = checkZeroLeft(dateObj.getHours());

    let newdate = year + "_" + month + "_" + day+'_'+hour+minutes+seconds;

    const deleteFiles = async (directory) => {
    if(fs.existsSync(directory)) {
      await toolbox.system.run(`php artisan migrate:rollback --path=${path.join(directory)}`, { trim: true })
      .then(async (i) => {
        console.log(i)
      }).catch((e) => {
        //console.log(e)
      });
      await toolbox.delay();
      fs.readdir(directory, async (err, files) => {
          if (err) throw err;
          for (const file of files) {
              await fs.unlink(path.join(directory, file), async (err) => {
                if (err) throw err;
              });
          }
        }); 
      }
    }
    await deleteFiles(`database/migrations/crudconfig/create/${table}`);
    await deleteFiles(`database/migrations/crudconfig/update/${table}`);

    //console.log(seconds, minutes, hour);
    await generate({
      template: 'migrate.js.ejs',
      target: `database/migrations/crudconfig/create/${table}/${newdate}_create_${table}_table.php`,
      props: { table, nameCapitalize, cmdMigration},
      //directory: './grao-config/'
    });
    
    success(`File migrate create database/migrations/crudconfig/create/${table}/${newdate}_create_${table}_table.php`);

    await generate({
      template: 'migrate-update.js.ejs',
      target: `database/migrations/crudconfig/update/${table}/${newdate}_update_${table}_table.php`,
      props: { table, nameCapitalize, cmdMigration},
      //directory: './grao-config/'
    });

    success(`File update migrate create database/migrations/crudconfig/update/${table}/${newdate}_create_${table}_table.php`);

    info(`RUN grao migrate ${table} --run`)

    //console.log(parameters);
    
    // let dir = './database/migrations/change_table_'+table;
    // if (!fs.existsSync(dir))
    // {

    // }

  }
}
