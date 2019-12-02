**\*\* `Project Title` \*\***
backendDevPractise is an application. This application is to retrieve articles and comments from Northcoders news. It utilises PostGres for access to its secure database. Also, for the purpose of testing, sqlite3 was used as the database of choice.

**`Installation`**
Steps to get started:

- \$ git clone https://github.com/sherpal8/backendDevPractise.git
- \$ cd backendDevPractise
- \$ npm install (installs all the dependencies below)
- \$ touch config.js (creates config.js in root folder level)
- in config.js, to copy and paste the following:
  `module.exports = { username: null, password: null };`

Note: Give actual values to username and password depending on your Operating System to allow for the functioniality of Postgres. Read postgres documentation for more information: https://www.postgresql.org/

##### Dependencies:

1. pg (i.e. postgres)
2. sqlite3
3. express
4. knex
5. cors (i.e. Corss-Origin-Resource-Sharing)

##### Dev dependencies:

1. chai
2. mocha
3. chai-sorted
4. supertest
5. nodemon

**`Instantiating development database`**
Install the software above. Then run the command below on your CLI:

- \$ npm run repopulateDB

This command will result in the setup and seeding of the development database.
This command can also be used to repopulate the development database should it be necessary.

- Note: The test database of sqlite3 will be autopopulated with the command \$ npm run test, resulting in the autogeneration of ./testDB.sqlite3 i.e. in the root-folder.

**`Testing`**

- \$ npm run testUtils (tests the utils function)

- \$ npm run test (tests the app function in general)

Check inside the ./spec folder for files for both tests.
The tests utilise mocha, chai, supertest, chai-sorted.

**`Other CLI commands available`**

- \$ npm run viewTables (output of production schemae in ./output.txt)

- \$ npm run dev (runs nodemon on port 9090 to then allow requests with the Insomnia rest client https://insomnia.rest/. Should PORT 9090 be blocked on your local computer, you may change the PORT number value in ./listen.js i.e. in the root folder)

- \$ npm run repopulateDB (to allow migration rollback, then migrate latest, and finally the re-seeding of PG production database should the need arise)

**`Author`**
Sherpal Singh.

**`License`**
Project licensed under MIT License.

**`Acknowledgements`**
To Northcoders, Leeds for the ready-to-use raw data and where all my foundational knowledge was received.
To Plural Sight for the more advanced knowledge received.
To the staff at One Tech Hub, Aberdeen who have made it possible for me to work in a conducive environment.
