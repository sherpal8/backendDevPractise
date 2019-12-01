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
        it("422: when author/username is not in the users table/ register", () => {
          return request
            .post("/api/articles/1/comments")
            .send({ username: "nonExistentUser", body: "hey" })
            .expect(422)
            .then(function({ body: { message } }) {
              expect(message).to.equal("Unprocessable entity");
            });
        });
      });
    });
    describe("GET", () => {
      // to increase variety of articles in test DB for better testing
      const populateComments = () => {
        return request
          .post("/api/articles/1/comments")
          .send({ username: "rogersop", body: "so inspiring right" })
          .then(function() {
            return request
              .post("/api/articles/1/comments")
              .send({ username: "icellusedkars", body: "feeling blessed" });
          });
      };
      it("returns with 200. Also, array of comment-objects, each with specified properties & values", () => {
        return populateComments().then(function() {
          return request
            .get("/api/articles/1/comments?sort_by=created_at&order_by=desc")
            .expect(200)
            .then(function({ body: { comments } }) {
              expect(Array.isArray(comments)).to.be.true;
              expect(comments.length).to.equal(3);
              comments.forEach((obj, i) => {
                expect(obj).to.have.all.keys(
                  "comment_id",
                  "votes",
                  "created_at",
                  "author",
                  "body"
                );
                if (i === 0) {
                  expect(obj).to.eql({
                    comment_id: 1,
                    votes: 16,
                    created_at: "Wed, 22 Nov 2017 12:36:03 GMT",
                    author: "butter_bridge",
                    body:
                      "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!"
                  });
                }
              });
            });
        });
      });
      it("when inappapriate values given for sort_by or order_by, default values assigned", () => {
        return populateComments().then(function() {
          return request
            .get("/api/articles/1/comments?sort_by=watcha&order_by=schwepps")
            .expect(200)
            .then(function({ body: { comments } }) {
              expect(comments[0].created_at).to.equal(
                "Wed, 22 Nov 2017 12:36:03 GMT"
              );
            });
        });
      });
      it("when ascending order_by given, position of objects will be reversed", () => {
        return populateComments().then(function() {
          return request
            .get("/api/articles/1/comments?sort_by=created_at&order_by=asc")
            .expect(200)
            .then(function({ body: { comments } }) {
              expect(comments[2].created_at).to.equal(
                "Wed, 22 Nov 2017 12:36:03 GMT"
              );
            });
        });
      });
      it("when sort_by given a different authorised value, the position of objects will be changed", () => {
        return populateComments().then(function() {
          return request
            .get("/api/articles/1/comments?sort_by=comment_id&order_by=desc")
            .expect(200)
            .then(function({ body: { comments } }) {
              expect(comments[0].comment_id).to.equal(6);
            });
        });
      });
      describe("Error handlers", () => {
        it("400: when article_id not a number", () => {
          return request
            .get("/api/articles/a/comments?sort_by=created_at&order_by=desc")
            .expect(400)
            .then(function({ body: { message } }) {
              expect(message).to.equal("Bad request");
            });
        });
        it("422: when article_id does not exist in articles table", () => {
          return request
            .get("/api/articles/1000/comments?sort_by=created_at&order_by=desc")
            .expect(422)
            .then(function({ body: { message } }) {
              expect(message).to.equal("Unprocessable entity");
            });
        });
      });
    });
    describe("405: Stray methods", () => {
      it("405: for when methods are not allowed", () => {
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
  describe("/api/articles", () => {
    describe("GET", () => {
      it("status 200, with an array of article-objects, each with specified properties and corresponding values", () => {
        return request
          .get("/api/articles")
          .expect(200)
          .then(function({ body: { articles } }) {
            expect(Array.isArray(articles)).to.be.true;
            expect(articles.length).to.equal(12);
            articles.forEach(function(obj, index) {
              expect(obj).to.have.all.keys(
                "author",
                "title",
                "article_id",
                "topic",
                "created_at",
                "votes",
                "comment_count"
              );
              if (index === 0) {
                expect(obj).to.eql({
                  author: "rogersop",
                  title:
                    "Seven inspirational thought leaders from Manchester UK",
                  article_id: 10,
                  topic: "mitch",
                  created_at: "Wed, 24 Nov 1982 12:21:54 GMT",
                  votes: null,
                  comment_count: 0
                });
              }
            });
          });
      });
      it("if sort_by argument given, articles sorted by valid column and by default in a descending order", () => {
        return request
          .get("/api/articles?sort_by=article_id")
          .expect(200)
          .then(function({ body: { articles } }) {
            expect(
              articles[0].article_id,
              articles[articles.length - 1].article_id
            ).to.equal(12, 1);
          });
      });
      it("if unauthorised sort_by argument given, articles sorted by default by created_at", () => {
        return request
          .get("/api/articles?sort_by=randomEntry")
          .expect(200)
          .then(function({ body: { articles } }) {
            expect(
              articles[0].created_at,
              articles[articles.length - 1].created_at
            ).to.equal(
              "Wed, 24 Nov 1982 12:21:54 GMT",
              "Fri, 20 Nov 1998 12:21:54 GMT"
            );
          });
      });
      it("if a different but valid sort_by argument given, articles sorted to that argument", () => {
        return request
          .get("/api/articles?sort_by=votes")
          .expect(200)
          .then(function({ body: { articles } }) {
            expect(articles[0].votes).to.equal(100);
          });
      });
      it("if order_by argument given is ascending, then the order of articles is reversed", () => {
        return request
          .get("/api/articles?sort_by=article_id&order_by=asc")
          .expect(200)
          .then(function({ body: { articles } }) {
            expect(articles[0].article_id, articles[11].aarticle_id).to.equal(
              1,
              12
            );
          });
      });
      it("if unauthorised order_by argument given, then default to descending order", () => {
        return request
          .get("/api/articles?sort_by=article_id&order_by=unauthorisedOrder")
          .expect(200)
          .then(function({ body: { articles } }) {
            expect(articles[0].article_id, articles[11].article_id).to.equal(
              12,
              1
            );
          });
      });
      it("if a query argument of `author` value given, filters articles by the author of that value", () => {
        return request
          .get("/api/articles?author=butter_bridge")
          .expect(200)
          .then(function({ body: { articles } }) {
            expect(articles).to.eql([
              {
                author: "butter_bridge",
                title: "Moustache",
                article_id: 12,
                topic: "mitch",
                created_at: "Tue, 26 Nov 1974 12:21:54 GMT",
                votes: null,
                comment_count: 0
              },
              {
                author: "butter_bridge",
                title: "Living in the shadow of a great man",
                article_id: 1,
                topic: "mitch",
                created_at: "Thu, 15 Nov 2018 12:21:54 GMT",
                votes: 100,
                comment_count: 1
              },
              {
                author: "butter_bridge",
                title: "They're not exactly dogs, are they?",
                article_id: 9,
                topic: "mitch",
                created_at: "Sun, 23 Nov 1986 12:21:54 GMT",
                votes: null,
                comment_count: 1
              }
            ]);
          });
      });
      it("if query argument of `topic` value given, filters articles by the topic of that value", () => {
        return request
          .get("/api/articles?topic=cats")
          .expect(200)
          .then(function({ body: { articles } }) {
            expect(articles).to.eql([
              {
                author: "rogersop",
                title: "UNCOVERED: catspiracy to bring down democracy",
                article_id: 5,
                topic: "cats",
                created_at: "Tue, 19 Nov 2002 12:21:54 GMT",
                votes: null,
                comment_count: 1
              }
            ]);
          });
      });

      describe("Error handlers", () => {
        it("400: if unauthorised query attempted", () => {
          return request
            .get(
              "/api/articles?nonExistentQuery=nonExistent&sort_by=article_id"
            )
            .expect(400)
            .then(function({ body: { message } }) {
              expect(message).to.equal("Bad request");
            });
        });
        it("404: if query argument `author` does not exist in database, returns `Page not found`", () => {
          return request
            .get("/api/articles?author=nonExistent")
            .expect(404)
            .then(function({ body: { message } }) {
              expect(message).to.equal("Page not found");
            });
        });
        it("404: if query argument `topic` does not exist in database, returns `Page not found`", () => {
          return request
            .get("/api/articles?topic=nonExistent")
            .expect(404)
            .then(function({ body: { message } }) {
              expect(message).to.equal("Page not found");
            });
        });
      });
    });
    describe("405: Stray methods", () => {
      it("405: when stray methods attempted", () => {
        const unauthorisedMethods = ["put", "post", "patch", "delete"];
        const unauthorisedPromises = unauthorisedMethods.map(function(method) {
          return request[method]("/api/articles")
            .expect(405)
            .then(function({ body: { message } }) {
              expect(message).to.equal("Method not allowed");
            });
        });
        return Promise.all(unauthorisedPromises);
      });
    });
  });
  describe("/api/comments/:comment_id", () => {
    describe("PATCH", () => {
      it("patch returns status 200. Votes increases with positive inc_votes value. Comment object with specific properties and updated value returned", () => {
        return request
          .patch("/api/comments/1")
          .send({ inc_votes: 1 })
          .expect(200)
          .then(function({ body: { comment } }) {
            expect(comment).to.eql({
              comment_id: 1,
              author: "butter_bridge",
              article_id: 1,
              votes: 17,
              created_at: "Wed, 22 Nov 2017 12:36:03 GMT",
              body:
                "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!"
            });
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
      it("when negative inc_votes value given, votes value reduced", () => {
        return request
          .patch("/api/comments/1")
          .send({ inc_votes: -2 })
          .expect(200)
          .then(function({ body: { comment } }) {
            expect(comment.votes).to.equal(14);
          });
      });
      describe("Error handlers", () => {
        it("400: when attempt to patch with non-number", () => {
          return request
            .patch("/api/comments/1")
            .send({ inc_votes: "%" })
            .expect(400)
            .then(function({ body: { message } }) {
              expect(message).to.equal("Bad request");
            });
        });
        it("400: when attempt to patch with empty string", () => {
          return request
            .patch("/api/comments/1")
            .send({ inc_votes: "" })
            .expect(400)
            .then(function({ body: { message } }) {
              expect(message).to.equal("Bad request");
            });
        });
        it("When attempt to patch with null", () => {
          return request
            .patch("/api/comments/1")
            .send({ inc_votes: null })
            .expect(400)
            .then(function({ body: { message } }) {
              expect(message).to.equal("Bad request");
            });
        });
        it("400: when comment_id not a number", () => {
          return request
            .patch("/api/comments/a")
            .send({ inc_votes: 2 })
            .expect(400)
            .then(function({ body: { message } }) {
              expect(message).to.equal("Bad request");
            });
        });
        it("422: when attempt to patch non-existent comment_id", () => {
          return request
            .patch("/api/comments/1000")
            .send({ inc_votes: 2 })
            .expect(422)
            .then(function({ body: { message } }) {
              expect(message).to.equal("Unprocessable entity");
            });
        });
      });
    });
    describe("DELETE", () => {
      it("204 with delete function, returning 'No content'", () => {
        return request
          .delete("/api/comments/4")
          .expect(204)
          .then(function({ body }) {
            expect(body).to.eql({});
          });
      });
      describe("Error handlers", () => {
        it("400: If comment_id entered is not a number", () => {
          return request
            .delete("/api/comments/notANumber")
            .expect(400)
            .then(function({ body: { message } }) {
              expect(message).to.equal("Bad request");
            });
        });
        it("422: If comment_id does not exist in database for deletion", () => {
          return request
            .delete("/api/comments/1000")
            .expect(422)
            .then(function({ body: { message } }) {
              expect(message).to.equal("Unprocessable entity");
            });
        });
      });
    });
    describe("405: Stray methods", () => {
      it("405: If unauthorised method attempted", () => {
        const unauthorisedMethods = ["put", "post", "get"];
        const promisesArr = unauthorisedMethods.map(function(method) {
          return request[method]("/api/comments/1")
            .expect(405)
            .then(function({ body: { message } }) {
              expect(message).to.equal("Method not allowed");
            });
        });
        return Promise.all(promisesArr);
      });
    });
  });
});
