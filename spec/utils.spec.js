const { expect } = require("chai");
const { modifyDateFunc } = require("../db/utils");

describe("test for utils function", () => {
  describe("modifyDateFunc", () => {
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
});
