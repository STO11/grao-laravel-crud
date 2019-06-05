
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
    //const mysql = require('mysql');
    const table = parameters.first;
    const nameCapitalize = strings.upperFirst(strings.camelCase(parameters.first));
    let dir = './composer.json';
    if (!fs.existsSync(dir)) {
      error('The file composer.json not found.');
      return false;
    }
    const config = await toolbox.getEnv();

    const composer = fs.readFileSync('composer.json').toString();
    let composeData = JSON.parse(composer);
    if (!composeData.require['doctrine/dbal']) {
      const install = await toolbox.prompt.confirm('This command requires that laravel have the doctrine/dbal package, do you want to install it?');
      if (install) {
        info("Running the 'composer require doctrine/dbal' command please wait ...");
        let cmdResult = await toolbox.system.run('composer require doctrine/dbal', { trim: true });
        info(cmdResult);
        info("Run again grao migrate " + table);

        if (!composeData.require['doctrine/dbal']) {
          return false;
        }

      } else {
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


    //========================================================================================================================================================================================
    //========================================================================================================================================================================================
    //====================================================================( CMD: grao migrate --run )====================================================================================================================
    //========================================================================================================================================================================================
    //========================================================================================================================================================================================

    if (parameters.options.run) {
      if (!table) {
        let files = await getAllFiles('./database/migrations/create');
        if (files) {
          files.map(async (path, i) => {
            let p = path.split('/');
            delete p[p.length - 1];
            path = p.join('/');
            toolbox.system.run(`php artisan migrate --path=${path}`, { trim: true })
              .then(async (dados) => {
                success(dados);
              });
          })
        }

        await toolbox.delay();
        await toolbox.delay();
        await toolbox.delay();
        await toolbox.delay();

        files = await getAllFiles('./database/migrations/update');
        if (files) {
          files.map(async (path, i) => {
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

    //========================================================================================================================================================================================
    //========================================================================================================================================================================================
    //====================================================================( CMD: grao migrate --rollback )====================================================================================================================
    //========================================================================================================================================================================================
    //========================================================================================================================================================================================

    if (parameters.options.rollback) {
      if (!table) {
        let files = await getAllFiles('./database/migrations/update');
        if (files) {
          files.sort().map(async (path, i) => {
            let p = path.split('/');
            delete p[p.length - 1];
            path = p.join('/');
            let migrateCreate = await toolbox.system.run(`php artisan migrate:rollback --path=${path}`, { trim: true })
              .then(async (dados) => {
                if (dados.match(/^Rolling back\:(.*)$/gm)) {
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

        files = await getAllFiles('./database/migrations/create');
        if (files) {
          files.sort().map(async (path, i) => {
            let p = path.split('/');
            delete p[p.length - 1];
            path = p.join('/');
            toolbox.system.run(`php artisan migrate:rollback --path=${path}`, { trim: true })
              .then((dados) => {
                if (dados.match(/^Rolling back\:(.*)$/gm)) {
                  success(dados.match(/^Rolling back\:(.*)$/gm)[0]);
                  success(dados.match(/^Rolled back\:(.*)$/gm)[0]);
                }
              });
          })
        }
        return true;
      }
    }

    //========================================================================================================================================================================================
    //========================================================================================================================================================================================
    //====================================================================( CMD: grao migrate table_name --run )====================================================================================================================
    //========================================================================================================================================================================================
    //========================================================================================================================================================================================

    if (parameters.options.run) {
      try {
        if (!table) {
          error(`Not found parameter table Example: grao migrate update table_name`);
          return false;
        }
        toolbox.system.run(`php artisan migrate --path=database/migrations/create/${table}`, { trim: true })
          .then((i) => {
            success(i)
            toolbox.system.run(`php artisan migrate --path=database/migrations/update/${table}`, { trim: true })
              .then((i) => {
                success(i)
              })
              .catch((e) => {
                info(e);
              });
          })
          .catch((e) => {
            info(e);
          });
      } catch (e) {
        info(e)
      }
      return true;
    }


    //========================================================================================================================================================================================
    //========================================================================================================================================================================================
    //====================================================================( CMD: grao migrate table_name --rollback )====================================================================================================================
    //========================================================================================================================================================================================
    //========================================================================================================================================================================================
    if (parameters.options.rollback) {
      try {
        if (!table) {
          error(`Not found parameter table Example: grao migrate update table_name`);
          return false;
        }

        let filesRoll = await getAllFiles('./database/migrations/create/' + table);
        let filesUpRoll = await getAllFiles('./database/migrations/update/' + table);
        if (filesRoll) {
          filesRoll.sort().map(async (path, i) => {
            let p = path.split('/');
            let mi = p[p.length - 1].replace('.php', '');
            await toolbox.mysqlQuery('delete from migrations where migration = "' + mi + '"', config.get('DB_HOST'), config.get('DB_USERNAME'), config.get('DB_PASSWORD'), config.get('DB_DATABASE'), config.get('DB_PORT'));
            await toolbox.mysqlQuery('SET FOREIGN_KEY_CHECKS = 0', config.get('DB_HOST'), config.get('DB_USERNAME'), config.get('DB_PASSWORD'), config.get('DB_DATABASE'), config.get('DB_PORT'));
            toolbox.mysqlQuery('DROP TABLE ' + table, config.get('DB_HOST'), config.get('DB_USERNAME'), config.get('DB_PASSWORD'), config.get('DB_DATABASE'), config.get('DB_PORT'))
              .then((dados) => { })
              .catch(() => { });
            await toolbox.mysqlQuery('SET FOREIGN_KEY_CHECKS = 1', config.get('DB_HOST'), config.get('DB_USERNAME'), config.get('DB_PASSWORD'), config.get('DB_DATABASE'), config.get('DB_PORT'));
            success(`Rolling back: ` + mi);
            success(`Rolled back:  ` + mi);
          });
        }
        if (filesUpRoll) {
          filesUpRoll.sort().map(async (path, i) => {
            let p = path.split('/');
            let mi = p[p.length - 1].replace('.php', '');
            await toolbox.mysqlQuery('delete from migrations where migration = "' + mi + '"', config.get('DB_HOST'), config.get('DB_USERNAME'), config.get('DB_PASSWORD'), config.get('DB_DATABASE'), config.get('DB_PORT'));
            success(`Rolling back: ` + mi);
            success(`Rolled back:  ` + mi);
          });
        }
      } catch (e) { }
      return false;
    }

    //========================================================================================================================================================================================
    //========================================================================================================================================================================================
    //====================================================================( CMD: grao migrate table_name --update )====================================================================================================================
    //========================================================================================================================================================================================
    //========================================================================================================================================================================================

    if (parameters.options.update) {

      if (!table) {
        error(`Not found parameter table Example: grao migrate update table_name`);
        return false;
      }

      let filesUpRoll = await getAllFiles('./database/migrations/update/' + table);
      if (filesUpRoll) {
        filesUpRoll.sort().map(async (path, i) => {
          let p = path.split('/');
          let mi = p[p.length - 1].replace('.php', '');
          await toolbox.mysqlQuery('delete from migrations where migration = "' + mi + '"', config.get('DB_HOST'), config.get('DB_USERNAME'), config.get('DB_PASSWORD'), config.get('DB_DATABASE'), config.get('DB_PORT'));
          success(`Rolling back: ` + mi);
          success(`Rolled back:  ` + mi);
        });
      }

      await toolbox.delay();
      await toolbox.delay();

      let migrateUpdate = await toolbox.system.run(`php artisan migrate --path=database/migrations/update/${table}`, { trim: true });
      success(migrateUpdate);

      return true;
    }

    //========================================================================================================================================================================================
    //========================================================================================================================================================================================
    //====================================================================( CMD: grao migrate table_name --fields="name:type" )====================================================================================================================
    //========================================================================================================================================================================================
    //========================================================================================================================================================================================

    if (!parameters.options.fields) {
      error('Parameter --fields not found in command. Example: > grao migrate table_name --fields={rel_id:bigInteger, nome:string,email:string}');
      return false;
    }

    let cmdMigration = [];
    let param = parameters.options.fields.split(',');
    if (param.length) {
      for (let i in param) {
        if (param[i].split(':').length) {
          let [field, type] = param[i].split(':');
          if (field && type) {
            cmdMigration[strings.trim(field)] = strings.trim(type);
          }
        }
      }
    }

    //futute implemetation foreing key
    if (parameters.options.fks) {
      //error('Parameter --fks not found in command. ');
    }

    await toolbox.delay();

    const checkZeroLeft = (n) => {
      if (n < 10)
        return '0' + n;
      return n;
    }

    let dateObj = new Date();
    let month = checkZeroLeft(dateObj.getUTCMonth() + 1); //months from 1-12
    let day = checkZeroLeft(dateObj.getUTCDate());
    let year = dateObj.getUTCFullYear();

    let seconds = checkZeroLeft(dateObj.getSeconds());
    let minutes = checkZeroLeft(dateObj.getMinutes());
    let hour = checkZeroLeft(dateObj.getHours());

    let newdate = year + "_" + month + "_" + day + '_' + hour + minutes + seconds;

    const deleteFiles = async (directory) => {
      if (fs.existsSync(directory)) {
        fs.readdir(directory, async (err, files) => {
          if (err) throw err;
          for (const file of files) {
            let p = file.split('/');
            let mi = p[p.length - 1].replace('.php', '');
            await toolbox.mysqlQuery('delete from migrations where migration = "' + mi + '"', config.get('DB_HOST'), config.get('DB_USERNAME'), config.get('DB_PASSWORD'), config.get('DB_DATABASE'), config.get('DB_PORT'));
            await fs.unlink(path.join(directory, file), async (err) => {
              if (err) throw err;
            });
          }
        });
      }
    }
    await deleteFiles(`database/migrations/create/${table}`);
    await deleteFiles(`database/migrations/update/${table}`);

    await generate({
      template: 'migrate.js.ejs',
      target: `database/migrations/create/${table}/${newdate}_create_${table}_table.php`,
      props: { table, nameCapitalize, cmdMigration },
      //directory: './grao-config/'
    });

    await generate({
      template: 'migrate-update.js.ejs',
      target: `database/migrations/update/${table}/${newdate}_update_${table}_table.php`,
      props: { table, nameCapitalize, cmdMigration },
      //directory: './grao-config/'
    });

    info('==================================================================================================================');
    success(`Change file database/migrations/update/${table}/${newdate}_create_${table}_table.php and 'run grao migrate ${table} --run' or 'grao migrate --run' for run all migrations.`)
    success(`File update migrate create database/migrations/update/${table}/${newdate}_create_${table}_table.php. If you want to update the migration, change this file and run 'grao migrate ${table} --update'`);
    info('==================================================================================================================');
  }
}
