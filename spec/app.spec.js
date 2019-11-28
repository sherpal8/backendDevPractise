// process.env.NODE_ENV -> imperative at top most
// to establish environment prior to calling
// connection.js and then knexfile.js
process.env.NODE_ENV = "test";

const { app } = require("../app");
const request = require("supertest")(app);
const chai = require("chai");
const { expect } = chai;
const chaiSorted = require("chai-sorted");
const { connection } = require("../connection");
chai.use(chaiSorted);

const refreshTablesFunc = function() {
  return connection.migrate
    .rollback()
    .then(function() {
      return connection.migrate.latest();
    })
    .then(function() {
      return connection.seed.run({
        specific: "01-topics.js"
      });
    })
    .then(function() {
      return connection.seed.run({
        specific: "02-users.js"
      });
    })
    .then(function() {
      return connection.seed.run({
        specific: "03-articles.js"
      });
    })
    .then(function() {
      return connection.seed.run({
        specific: "04-comments.js"
      });
    })
    .catch(function(err) {
      console.log(err);
    });
};

beforeEach(function() {
  return refreshTablesFunc();
});

after(function() {
  return connection.destroy();
});

describe("App TDD", () => {
  describe("Error 404: Stray endpoints", () => {
    it("status 404 with error message", () => {
      return request
        .get("/morningAll")
        .expect(404)
        .then(function({ body: { message } }) {
          expect(message).to.equal("Page does not exist");
        });
    });
  });
  describe("/api", () => {
    describe("GET", () => {
      it("responds 200 with 'Welcome to Vital News", () => {
        return request
          .get("/api")
          .expect(200)
          .then(function({ body: { message } }) {
            expect(message).to.equal("Welcome to Vital News");
          });
      });
    });
    describe("405: Stray methods", () => {
      it("405 for when methods are not allowed", () => {
        const methods = ["post", "delete", "patch", "put"];
        const promises = methods.map(method => {
          return request[method]("/api")
            .expect(405)
            .then(({ body: { message } }) => {
              expect(message).to.equal("Method not allowed");
            });
        });
        return Promise.all(promises);
      });
    });
  });
  describe("/api/topics", () => {
    describe("GET", () => {
      it("status 200 with object", () => {
        return request
          .get("/api/topics")
          .expect(200)
          .then(function({ body }) {
            expect(body).to.eql({
              topics: [
                {
                  slug: "mitch",
                  description: "The man, the Mitch, the legend"
                },
                { slug: "cats", description: "Not dogs" },
                { slug: "paper", description: "what books are made of" }
              ]
            });
          });
      });
    });
    describe("405: Stray methods", () => {
      it("405 for when methods are not allowed", () => {
        const methods = ["post", "delete", "patch", "put"];
        const promises = methods.map(method => {
          return request[method]("/api/topics")
            .expect(405)
            .then(({ body: { message } }) => {
              expect(message).to.equal("Method not allowed");
            });
        });
        return Promise.all(promises);
      });
    });
  });
  describe("/api/users/:username", () => {
    describe("GET", () => {
      it("request with status 200 and object", () => {
        return request
          .get("/api/users/rogersop")
          .expect(200)
          .then(function({ body }) {
            expect(body).to.eql({
              user: [
                {
                  username: "rogersop",
                  avatar_url:
                    "https://avatars2.githubusercontent.com/u/24394918?s=400&v=4",
                  name: "paul"
                }
              ]
            });
          });
      });
      it("Error 404: When username does not exist", () => {
        return request
          .get("/api/users/sherpal")
          .expect(404)
          .then(function({ body: { message } }) {
            expect(message).to.equal("Page does not exist");
          });
      });
    });
    describe("405: Stray methods", () => {
      it("405 for when methods are not allowed", () => {
        const methods = ["post", "delete", "patch", "put"];
        const promises = methods.map(method => {
          return request[method]("/api/users/jessjelly")
            .expect(405)
            .then(({ body: { message } }) => {
              expect(message).to.equal("Method not allowed");
            });
        });
        return Promise.all(promises);
      });
    });
  });
  describe("/api/articles/:article_id", () => {
    describe("GET", () => {
      it("request with status 200 & an object with the correct properties", () => {
        return request
          .get("/api/articles/1")
          .expect(200)
          .then(function({ body }) {
            expect(body).to.eql({
              article: {
                author: "butter_bridge",
                title: "Living in the shadow of a great man",
                article_id: 1,
                body: "I find this existence challenging",
                topic: "mitch",
                created_at: "Thu, 15 Nov 2018 12:21:54 GMT",
                votes: 100,
                comment_count: 1
              }
            });
            expect(typeof body).to.equal("object");
            expect(Array.isArray(body)).to.equal(false);
            expect(body === null).to.equal(false);
            expect(body.article).to.contain.keys(
              "author",
              "title",
              "article_id",
              "body",
              "topic",
              "created_at",
              "votes",
              "comment_count"
            );
          });
      });
      describe("GET Error handlers", () => {
        it("400: non-number attempted as article_id", () => {
          return request
            .get("/api/articles/sh")
            .expect(400)
            .then(function({ body: { message } }) {
              expect(message).to.equal("Bad request");
            });
        });
        it("422: when an extreme number inserted that is not processable", () => {
          return request
            .get("/api/articles/1000")
            .expect(422)
            .then(function({ body: { message } }) {
              expect(message).to.equal("Unprocessable entity");
            });
        });
      });
    });
    describe("PATCH", () => {
      it("positive inc_votes: responds with 200 & updated object with rise in the `votes` property value", () => {
        return request
          .patch("/api/articles/1")
          .send({ inc_votes: 1 })
          .expect(200)
          .then(function({ body }) {
            expect(body).to.eql({
              article: {
                article_id: 1,
                title: "Living in the shadow of a great man",
                body: "I find this existence challenging",
                votes: 101,
                topic: "mitch",
                author: "butter_bridge",
                created_at: "Thu, 15 Nov 2018 12:21:54 GMT"
              }
            });
          });
      });
      it("negative inc_votes: responds with drop in the `votes` property value", () => {
        return request
          .patch("/api/articles/1")
          .send({ inc_votes: -2 })
          .expect(200)
          .then(function({
            body: {
              article: { votes }
            }
          }) {
            expect(votes).to.equal(98);
          });
      });
      describe("PATCH Error handlers", () => {
        it("400: When attempt to patch with a non-number", () => {
          return request
            .patch("/api/articles/1")
            .send({ inc_votes: "a" })
            .expect(400)
            .then(({ body: { message } }) => {
              expect(message).to.equal("Bad request");
            });
        });
        it("400: When attempt to patch with nothing i.e. empty string", () => {
          return request
            .patch("/api/articles/1")
            .send({ inc_votes: "" })
            .expect(400)
            .then(({ body: { message } }) => {
              expect(message).to.equal("Bad request");
            });
        });
      });
    });
    describe("405: Stray methods", () => {
      it("405 for when methods are not allowed", () => {
        const methods = ["post", "delete", "put"];
        const promises = methods.map(method => {
          return request[method]("/api/articles/1")
            .expect(405)
            .then(({ body: { message } }) => {
              expect(message).to.equal("Method not allowed");
            });
        });
        return Promise.all(promises);
      });
    });
  });
  describe("/api/articles/:article_id/comments", () => {
    describe("POST", () => {
      it("returns status 201, along with posted comment with specified properties", () => {
        return request
          .post("/api/articles/1/comments")
          .send({ username: "rogersop", body: "amazing article" })
          .expect(201)
          .then(function({ body: { comment } }) {
            expect(
              comment.comment_id,
              comment.author,
              comment.article_id,
              comment.votes,
              comment.body
            ).to.equal(5, "rogersop", 1, 0, "amazing article");
            expect(comment).to.have.all.keys(
              "comment_id",
              "author",
              "article_id",
              "votes",
              "created_at",
              "body"
            );
          });
      });
      describe("Error handlers", () => {
        it("400: When empty argument posted", () => {
          return request
            .post("/api/articles/1/comments")
            .send()
            .expect(400)
            .then(function({ body: { message } }) {
              expect(message).to.equal("Bad request");
            });
        });
        it("400: When empty object posted", () => {
          return request
            .post("/api/articles/1/comments")
            .send({})
            .expect(400)
            .then(function({ body: { message } }) {
              expect(message).to.equal("Bad request");
            });
        });
        it("400: When object does not have the two required properties i.e. username and body", () => {
          return request
            .post("/api/articles/1/comments")
            .send({ username: "rogersop" })
            .expect(400)
            .then(function({ body: { message } }) {
              expect(message).to.equal("Bad request");
            });
        });
        it("400: When object has right properties, but either or both the values are empty", () => {
          return request
            .post("/api/articles/1/comments")
            .send({ username: "", body: "" })
            .expect(400)
            .then(function({ body: { message } }) {
              expect(message).to.equal("Bad request");
            });
        });
        it("400: When article_id parameter is not a number", () => {
          return request
            .post("/api/articles/a/comments")
            .send({ username: "jessy", body: "hey" })
            .expect(400)
            .then(function({ body: { message } }) {
              expect(message).to.equal("Bad request");
            });
        });
        it("422: When article_id is non-existant in articles table", () => {
          return request
            .post("/api/articles/1000/comments")
            .send({ username: "jessy", body: "hey" })
            .expect(422)
            .then(function({ body: { message } }) {
              expect(message).to.equal("Unprocessable entity");
            });
        });
      });
    });
    describe("405: Stray methods", () => {
      it("405 for when methods are not allowed", () => {
        const methods = ["delete", "put", "patch"];
        const promises = methods.map(method => {
          return request[method]("/api/articles/1/comments")
            .expect(405)
            .then(({ body: { message } }) => {
              expect(message).to.equal("Method not allowed");
            });
        });
        return Promise.all(promises);
      });
    });
  });
});
