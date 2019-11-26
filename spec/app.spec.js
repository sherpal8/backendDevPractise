process.env.NODE_ENV = "test";

const { app } = require("../app");
const request = require("supertest")(app);
const db = require("../connection");
const chai = require("chai");
const { expect } = chai;
const chaiSorted = require("chai-sorted");
chai.use(chaiSorted);

describe("/api", () => {
  describe("GET", () => {
    it("responds 200 with 'Welcome to Vital News", () => {
      return request
        .get("/api")
        .expect(200)
        .then(function(val) {
          console.log(val);
        });
    });
  });
});
