# Grão CLI (Crud para Laravel)

Um CLI para criação de arquivos básicos para Laravel.

# Usage (Install global) 

----------------------------------------------------

npm i -g grao-laravel-crud

----------------------------------------------------

# Usage (CLI)
----------------------------------------------------

Before running the command, the table in the database should exist.

IMPORTANT: This module only uses MYSQL connection, reading the .env file.

COMMAND:
> grao g table_name namespace 
or 
> grao generate table_name namespace

Where table_name is the name of the table

Where namespace is the name of the Workspace / Namespace.

----------------------------------------------------

# Folder grao-config (CLI)

----------------------------------------------------

If you want to change something in the next 'grud',
the grao-config folder will be created in your directory with .ejs files for modifications,
any modification to these files will affect the generation of the grud`s files in the application. 
If you want to re-create the folder just delete it and the files will come in the default.

Or you can use the command below in laravel project. 
He had erased and recreated the folder:

> grao reset
or 
> grao r

----------------------------------------------------
# License

MIT - see LICENSE

