
module.exports = {
    name: 'reset',
    alias: ['r'],
    run: async toolbox => {
      const { print: { info, error, success } } = toolbox
      const fs = require('fs');
      const rmdirAsync = function(path, callback) {
          fs.readdir(path, function(err, files) {
              if(err) {
                  // Pass the error on to callback
                  callback(err, []);
                  return;
              }
              var wait = files.length,
                  count = 0,
                  folderDone = function(err) {
                  count++;
                  // If we cleaned out all the files, continue
                  if( count >= wait || err) {
                      fs.rmdir(path,callback);
                  }
              };
              // Empty directory to bail early
              if(!wait) {
                  folderDone();
                  return;
              }
              // Remove one or more trailing slash to keep from doubling up
              path = path.replace(/\/+$/,"");
              files.forEach(function(file) {
                  var curPath = path + "/" + file;
                  fs.lstat(curPath, function(err, stats) {
                      if( err ) {
                          callback(err, []);
                          return;
                      }
                      if( stats.isDirectory() ) {
                          rmdirAsync(curPath, folderDone);
                      } else {
                          fs.unlink(curPath, folderDone);
                      }
                  });
              });
          });
      };

      info('Reseting config folder');

      rmdirAsync('./grao-config', function() {
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
            fs.readFile(__dirname+'/../templates/edit.js.ejs', function(err, data) {
                if (err) {
                throw err;
                }
                fs.writeFile('./grao-config/edit.js.ejs', data,function(err, data) {
                if (err) {
                    throw err;
                }
                });
            });

            fs.readFile(__dirname+'/../templates/show.js.ejs', function(err, data) {
                if (err) {
                throw err;
                }
                fs.writeFile('./grao-config/show.js.ejs', data,function(err, data) {
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

            let path = '{'+toolbox.filesystem.eol+'\
            "model":"app", '+toolbox.filesystem.eol+'\
            "views":"resources/views" '+toolbox.filesystem.eol+'\}';
            fs.writeFile('./grao-config/path.config.json', path, function (err, data) {
                if (err) {
                throw err;
                }
            });
        }
        success('Successfully config reset');
        });

    }
}
  