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
  describe("Error: Stray endpoints", () => {
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
    });
  });
});
