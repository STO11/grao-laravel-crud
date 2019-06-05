# Grão CLI (Crud for Laravel)

A CLI for creating basic files for Laravel

- Creation of migrations.
- Creation of controllers.
- Creation of models.
- Creation of views.
- All in few commands =).

# Usage (Install global) 

----------------------------------------------------

```sh

$ npm i -g grao-laravel-crud

```

----------------------------------------------------

# New Features!

----------------------------------------------------

  - Managing migrations by commands.
  - Ease of creating and updating migrations by CLI.

----------------------------------------------------
# Usage (CLI) Migrations
- ATTENTION: `This feature supports only Mysql database`

> The migration system generates two files, one for creation and one for updating.
> These files are generated in `database/migrations/create` and `database/migrations/update`

> The file inside `database/migrations/create` will create the tables in the database to be used in the rollback and creation.
> The update file inside `database/migrations/update` will only serve to modify the database table. `--update`

>To generate these files use the command below:

```sh

$ grao migrate table_name --fields="field1:string, field2:string, field3:text, field4:int, field1:biginteger"

```
> obs: `The file already comes with the autoincrement id`.

| params | description |
| ------ | ------ |
| `table_name` | The name of the database table |
| `--fields` | Name the fields with their types separated by a colon. |

> Go to the file do the necessary and then run the commands below to create the table in the database:

```sh

$ grao migrate table_name --run

```

> We can update a migration. The update file is in `database/migrations/update/table_name`:

```sh

$ grao migrate table_name --update

```

> We can also run specific rollback with the command below:

```sh

$ grao migrate table_name --rollback

```

> If you want you can run all created migrations.

```sh

$ grao migrate --run

```

> We can rollback all migrations.

```sh

$ grao migrate --rollback

```

| params | description |
| ------ | ------ |
| `table_name` | The name of the database table |
| `run` | Command to create |
| `rollback` | Command to return |
| `update` | Command to update the table |

# Usage (CLI) Generate
----------------------------------------------------

> Before running the command, the table in the database should exist.

> IMPORTANT: This module only uses MYSQL connection, reading the .env file.

> COMMAND:

```sh

$ grao g table_name namespace 

```

or 

```sh

$ grao generate table_name namespace

```

| params | description |
| ------ | ------ |
| `table_name` | The name of the database table |
| `namespace` | The name of the Workspace / Namespace in Laravel |


----------------------------------------------------

# Folder grao-config (CLI)

----------------------------------------------------

> If you want to change something in the next 'crud',
> the grao-config folder will be created in your directory with .ejs files for modifications,
> any modification to these files will affect the generation of the crud`s files in the application. 
> If you want to re-create the folder just delete it and the files will come in the default.

> Or you can use the command below in laravel project. 
> He had erased and recreated the folder:

```sh

$ grao reset

```

or 

```sh

$ grao r

```


----------------------------------------------------

# routes.php 

----------------------------------------------------
> Path: grao-config/routes.php

> This file adds the routes generated by the commands, always at the end of the file. 

> Copy and paste into your Laravel route file.


----------------------------------------------------
# License

MIT - see LICENSE

