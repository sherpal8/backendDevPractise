const { expect } = require("chai");
const { modifyDateFunc, modifyCommentsData } = require("../db/utils");

process.env.NODE_ENV = "test";

describe("test for utils function", () => {
  describe("modifyDateFunc()", () => {
    it("when given empty array, return an empty array", () => {
      expect(modifyDateFunc([])).to.eql([]);
    });
    it("returns new array that is not the same as the original array", () => {
      const originalArr = [];
      expect(modifyDateFunc(originalArr)).to.not.equal(originalArr);
    });
    it("check original array not mutated", () => {
      const originalArr = [
        {
          title: "Living in the shadow of a great man",
          topic: "mitch",
          author: "butter_bridge",
          body: "I find this existence challenging",
          created_at: 1542284514171,
          votes: 100
        }
      ];
      modifyDateFunc(originalArr);
      expect(originalArr).to.eql([
        {
          title: "Living in the shadow of a great man",
          topic: "mitch",
          author: "butter_bridge",
          body: "I find this existence challenging",
          created_at: 1542284514171,
          votes: 100
        }
      ]);
    });
    it("processes value of created_at date property of single-object array into PG compatible format", () => {
      const originalArr = [
        {
          title: "Living in the shadow of a great man",
          topic: "mitch",
          author: "butter_bridge",
          body: "I find this existence challenging",
          created_at: 1542284514171,
          votes: 100
        }
      ];
      expect(modifyDateFunc(originalArr)).to.eql([
        {
          title: "Living in the shadow of a great man",
          topic: "mitch",
          author: "butter_bridge",
          body: "I find this existence challenging",
          created_at: "Thu, 15 Nov 2018 12:21:54 GMT",
          votes: 100
        }
      ]);
    });
    it("processes value of created_at date property of multi-object array into PG compatible format", () => {
      const originalArr = [
        {
          title: "Wah great man",
          topic: "mitch",
          author: "butter_bridge",
          body: "I find this existence challenging",
          created_at: 1542284513000,
          votes: 100
        },
        {
          title: "Living in the shadow of a great man",
          topic: "mitch",
          author: "butter_bridge",
          body: "I find this existence challenging",
          created_at: 1542284514171,
          votes: 100
        }
      ];
      expect(modifyDateFunc(originalArr)).to.eql([
        {
          title: "Wah great man",
          topic: "mitch",
          author: "butter_bridge",
          body: "I find this existence challenging",
          created_at: "Thu, 15 Nov 2018 12:21:53 GMT",
          votes: 100
        },
        {
          title: "Living in the shadow of a great man",
          topic: "mitch",
          author: "butter_bridge",
          body: "I find this existence challenging",
          created_at: "Thu, 15 Nov 2018 12:21:54 GMT",
          votes: 100
        }
      ]);
    });
  });

  describe("modifyCommentsData()", () => {
    it("returns a new array", done => {
      const originalArr = [];
      return modifyCommentsData(originalArr).then(function(outputValue) {
        return expect(outputValue).to.not.equal(originalArr);
      });
    });
    it("original data not mutated", () => {
      const originalArr = [
        {
          body:
            "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
          belongs_to:
            "Sweet potato & butternut squash soup with lemon & garlic toast",
          created_by: "butter_bridge",
          votes: 16,
          created_at: 1511354163389
        }
      ];
      return modifyCommentsData(originalArr).then(function(outputValue) {
        return expect(originalArr).to.eql([
          {
            body:
              "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
            belongs_to:
              "Sweet potato & butternut squash soup with lemon & garlic toast",
            created_by: "butter_bridge",
            votes: 16,
            created_at: 1511354163389
          }
        ]);
      });
    });
    it("processes a single element array of an object", () => {
      const inputData = [
        {
          body:
            "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
          belongs_to:
            "Which current Premier League manager was the best player?",
          created_by: "butter_bridge",
          votes: 16,
          created_at: 1511354163389
        }
      ];
      const expectedVal = [
        {
          body:
            "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
          votes: 16,
          created_at: "Wed, 22 Nov 2017 12:36:03 GMT",
          article_id: 17,
          author: "butter_bridge"
        }
      ];
      return modifyCommentsData(inputData).then(function(outputVal) {
        return expect(outputVal).to.eql(expectedVal);
      });
    });
    it("processes multi element array of objects", () => {
      const inputData = [
        {
          body:
            "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
          belongs_to: "High Altitude Cooking",
          created_by: "butter_bridge",
          votes: 16,
          created_at: 1511354163389
        },
        {
          body:
            "The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky.",
          belongs_to:
            "Defensive Metrics: Measuring the Intensity of a High Press",
          created_by: "butter_bridge",
          votes: 14,
          created_at: 1479818163389
        }
      ];
      const expectedVal = [
        {
          body:
            "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
          votes: 16,
          created_at: "Wed, 22 Nov 2017 12:36:03 GMT",
          article_id: 22,
          author: "butter_bridge"
        },
        {
          body:
            "The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky.",
          votes: 14,
          created_at: "Tue, 22 Nov 2016 12:36:03 GMT",
          article_id: 28,
          author: "butter_bridge"
        }
      ];
      return modifyCommentsData(inputData).then(outputValue => {
        return expect(outputValue).to.eql(expectedVal);
      });
    });
  });
});
