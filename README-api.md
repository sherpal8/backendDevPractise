**\*\* Project Title \*\***
backendDevPractise is an application. This application is to retrieve articles and comments from Northcoders news. It utilises PostGres for access to its secure database. Also, for the purpose of testing, sqlite3 was used as the database of choice.

**Prerequisites**
To get started, install the following as below via npm installation.

#### dependencies:

1. pg (postgres)
2. sqlite3
3. express
4. knex
5. cors (i.e. Corss-Origin-Resource-Sharing)

#### dev dependencies:

1. chai
2. mocha
3. chai-sorted
4. supertest
5. nodemon

**Installation**
Install the software above. Then run the command below on your CLI:
\$ npm run dev

This will result seeding of the database and set up the development environment.

**Testing**
To test the utils function:
\$ npm run testUtils

To test the app function in general
\$ npm run test

Check inside the ./spec folder for files for both tests.
The tests utilise mocha, chai, supertest, chai-sorted.

**Other CLI commands available**

- \$ npm run viewTables (output of production schemae in ./output.txt)

- \$ npm run dev (runs nodemon on port 9090 to then allow requests with the Insomnia rest client https://insomnia.rest/)

- \$ npm run repopulateDB (to allow migration rollback, then migrate latest, and finally the re-seeding of PG production database should the need arise)

**Author**
Sherpal Singh.

**License**
Project licensed under MIT License.

**Acknowledgements**
To Northcoders, Leeds for the ready-to-use raw data and where all my foundational knowledge received.
To Plural Sight for the more advanced knowledge received.
To the staff at One Tech Hub, Aberdeen who have made it possible to work in a conducive environment.