# Project: backendDevPractise

This document is a general explanation of this project was completed. This is for the purpose of the ease of reproducibility for future projects.

For information on this API specifically, please refer to README-api.md.

### Objective:

This is a backend skills development project. The aim is to create and seed various databases in different environments. Then, the ability to retrieve the data using routers, controllers and models. This project has been a Test Driven Development.

### Environments considered:

- test
- development
- production

### Databases used:

- sqlite3
- postgresql

## Create and seed database for test and production environments:

### Steps:

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
- run \`npm i -D chai mocha\`

## Creating a server to retrieve data:

### Steps:

- npm i express
- npm i -D nodemon supertest chai-sorted
- use Insomnia to make variety of requests to view output of production database
- test driven development utilising mocha framework and chai assertations
- keep endpoints RESTful
- ensure to use `express().use(express.json())` in app.js as it parses incoming json data
- also `express().use(cors())` to allow for Cross-Origin-Resource-Sharing during front-end development

### These are the endpoints created:

- GET /api
- GET /api/topics
- GET /api/users/:username
- GET /api/articles/:article_id
- PATCH /api/articles/:article_id
- POST /api/articles/:article_id/comments
- GET /api/articles/:article_id/comments
- GET /api/articles
- PATCH /api/comments/:comment_id
- DELETE /api/comments/:comment_id

### Route Requirements (referenced from Northcoders)

All endpoints should send the below responses in an object, with a key name of what it is that being sent. e.g.

```json
{
  "topics": [
    {
      "description": "Code is love, code is life",
      "slug": "coding"
    },
    {
      "description": "FOOTIE!",
      "slug": "football"
    },
    {
      "description": "Hey good looking, what you got cooking?",
      "slug": "cooking"
    }
  ]
}
```

```http
GET /api
```

#### Responds with

- a json with endpoints for the API.

---

```http
GET /api/topics
```

#### Responds with

- an array of topic objects, each of which should have the following properties:
  - `slug`
  - `description`

---

```http
GET /api/users/:username
```

#### Responds with

- a user object which should have the following properties:
  - `username`
  - `avatar_url`
  - `name`

---

```http
GET /api/articles/:article_id
```

#### Responds with

- an article object, which should have the following properties:

  - `author` which is the `username` from the users table
  - `title`
  - `article_id`
  - `body`
  - `topic`
  - `created_at`
  - `votes`
  - `comment_count` which is the total count of all the comments with this article_id. To make use of knex queries in order to achieve this

---

```http
PATCH /api/articles/:article_id
```

#### Request body accepts

- an object in the form `{ inc_votes: newVote }`

  - `newVote` will indicate how much the `votes` property in the database should be updated by

  e.g.

  `{ inc_votes : 1 }` would increment the current article's vote property by 1

  `{ inc_votes : -100 }` would decrement the current article's vote property by 100

#### Responds with

- the updated article

---

```http
POST /api/articles/:article_id/comments
```

#### Request body accepts

- an object with the following properties:
  - `username`
  - `body`

#### Responds with

- the posted comment

---

```http
GET /api/articles/:article_id/comments
```

#### Responds with

- an array of comments for the given `article_id` of which each comment should have the following properties:
  - `comment_id`
  - `votes`
  - `created_at`
  - `author` which is the `username` from the users table
  - `body`

#### Accepts queries

- `sort_by`, which sorts the comments by any valid column (defaults to created_at)
- `order_by`, which can be set to `asc` or `desc` for ascending or descending (defaults to descending)

---

```http
GET /api/articles
```

#### Responds with

- an `articles` array of article objects, each of which should have the following properties:
  - `author` which is the `username` from the users table
  - `title`
  - `article_id`
  - `topic`
  - `created_at`
  - `votes`
  - `comment_count` which is the total count of all the comments with this article_id. To make use of knex queries in order to achieve this

#### Should accept queries

- `sort_by`, which sorts the articles by any valid column (defaults to date)
- `order_by`, which can be set to `asc` or `desc` for ascending or descending (defaults to descending)
- `author`, which filters the articles by the username value specified in the query
- `topic`, which filters the articles by the topic value specified in the query

---

```http
PATCH /api/comments/:comment_id
```

#### Request body accepts

- an object in the form `{ inc_votes: newVote }`

  - `newVote` will indicate how much the `votes` property in the database should be updated by

  e.g.

  `{ inc_votes : 1 }` would increment the current article's vote property by 1

  `{ inc_votes : -1 }` would decrement the current article's vote property by 1

#### Responds with

- the updated comment

---

```http
DELETE /api/comments/:comment_id
```

#### Should

- delete the given comment by `comment_id`

#### Responds with

- status 204 and no content

### Hosting

Hosting is done via deployment to Heroku, with access to the free PG database on Heroku.
