process.env.NODE_ENV = "test";

const { app } = require("../app");
const request = require("supertest")(app);
const chai = require("chai");
const { expect } = chai;
const chaiSorted = require("chai-sorted");
const { connection } = require("../connection");
chai.use(chaiSorted);

describe("App TDD", () => {
  after(() => {
    connection.destroy();
  });
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
                { slug: "coding", description: "Code is love, code is life" },
                { slug: "football", description: "FOOTIE!" },
                {
                  slug: "cooking",
                  description: "Hey good looking, what you got cooking?"
                }
              ]
            });
          });
      });
    });
  });
  describe("/api/users/:username", () => {
    describe("GET", () => {
      it("request with status 200 and object", () => {
        return request
          .get("/api/users/jessjelly")
          .expect(200)
          .then(function({ body }) {
            expect(body).to.eql({
              user: [
                {
                  username: "jessjelly",
                  avatar_url:
                    "https://s-media-cache-ak0.pinimg.com/564x/39/62/ec/3962eca164e60cf46f979c1f57d4078b.jpg",
                  name: "Jess Jelly"
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
  });
  describe("/api/articles/:article_id", () => {
    describe("GET", () => {
      it("request with status 200 & an object with the correct properties", () => {
        return request
          .get("/api/articles/73")
          .expect(200)
          .then(function({ body }) {
            expect(body).to.eql({
              article: {
                author: "jessjelly",
                title: "Running a Node App",
                article_id: 73,
                body:
                  "This is part two of a series on how to get up and running with Systemd and Node.js. This part dives deeper into how to successfully run your app with systemd long-term, and how to set it up in a production environment.",
                topic: "coding",
                created_at: "Thu, 18 Aug 2016 12:07:52 GMT",
                votes: 0,
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
    });
    describe("Error handlers", () => {
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
});
