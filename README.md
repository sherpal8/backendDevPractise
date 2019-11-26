# Project: backendDevPractise

This is a backend skill development project. The aim is to create and seed various databases in different environments. Then, the ability to retrieve it.

### Environments considered:

- test
- development
- production

### Databases used:

- sqlite3
- postgresql

## Creating database for test and production environments:

### Steps to make this happen:

- created a folder then cd into it for the project
- mkdir db folder. Inside, data for test-data and development-data, with appropriate index.js files to extract the right data for the right environment
- npm init (reuslt package.json)
- npm install knex pg sqlite3
- knex init
- git init
- configurations in auto-generated knexfile.js
- personal/ private details in config.js
- connection.js to create connection with every knex call function
- .gitignore to ignore node_modules and config.js
- pgDbSetup.sql (run once to establish PG database)
- knex migrate:make, knex migrate:latest, knex migrate:callback to create schema
- viewSchemaeData.sql to view schemae, columns and the data in them (for pg)
- knex seed:make 01_topics to create different seed files in desired seed order
- knex seed:run
- also, inside knexfile.js, to set env to test, and then \`knex seed:run\` to populate sqlite3 db
- utils folder, utils function to process some data to enable seeing, with full TDD
