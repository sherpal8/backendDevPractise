process.env.NODE_ENV = "test";

const { expect } = require("chai");
const {
  modifyDateFunc,
  modifyCommentsData,
  processComments
} = require("../db/utils");

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
    it("returns a new array", () => {
      const originalArr = [];
      const outputValue = modifyCommentsData(originalArr);
      expect(outputValue).to.not.equal(originalArr);
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
      modifyCommentsData(originalArr);
      expect(originalArr).to.eql([
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
    it("processes a single element array", () => {
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
          belongs_to:
            "Which current Premier League manager was the best player?",
          author: "butter_bridge"
        }
      ];
      expect(modifyCommentsData(inputData)).to.eql(expectedVal);
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
          belongs_to: "High Altitude Cooking",
          author: "butter_bridge"
        },
        {
          body:
            "The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky.",
          votes: 14,
          created_at: "Tue, 22 Nov 2016 12:36:03 GMT",
          belongs_to:
            "Defensive Metrics: Measuring the Intensity of a High Press",
          author: "butter_bridge"
        }
      ];
      expect(modifyCommentsData(inputData)).to.eql(expectedVal);
    });
  });

  describe("processComments()", () => {
    it("when given an empty array, returns an empty array", () => {
      const arg1 = [];
      const arg2 = [];
      expect(processComments(arg1, arg2)).to.eql([]);
    });
    it("when given a single element array, processes the object as needed", () => {
      const arg1 = [
        {
          body:
            "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
          votes: 16,
          created_at: "Wed, 22 Nov 2017 12:36:03 GMT",
          belongs_to:
            "Which current Premier League manager was the best player?",
          author: "butter_bridge"
        }
      ];
      const arg2 = [{ article_id: 2 }];
      expect(processComments(arg1, arg2)).to.eql([
        {
          body:
            "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
          votes: 16,
          created_at: "Wed, 22 Nov 2017 12:36:03 GMT",
          author: "butter_bridge",
          article_id: 2
        }
      ]);
    });
    it("when given multi element array, processes the objects accordingly", () => {
      const arg1 = [
        {
          body:
            "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
          votes: 16,
          created_at: "Wed, 22 Nov 2017 12:36:03 GMT",
          belongs_to:
            "Which current Premier League manager was the best player?",
          author: "butter_bridge"
        },
        {
          body: "Wakaya kumata takagiri",
          votes: 17,
          created_at: "Wed, 22 Nov 2017 12:36:03 GMT",
          belongs_to: "The nation of New Beautiful Zealand",
          author: "butter_bridge"
        }
      ];
      const arg2 = [{ article_id: 21 }, { article_id: 23 }];
      expect(processComments(arg1, arg2)).to.eql([
        {
          body:
            "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
          votes: 16,
          created_at: "Wed, 22 Nov 2017 12:36:03 GMT",
          author: "butter_bridge",
          article_id: 21
        },
        {
          body: "Wakaya kumata takagiri",
          votes: 17,
          created_at: "Wed, 22 Nov 2017 12:36:03 GMT",
          author: "butter_bridge",
          article_id: 23
        }
      ]);
    });
  });
});
