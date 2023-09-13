const { Parties, Tags, Amenities } = require("../models");
const { Op } = require("sequelize");

exports.search = async (req, res) => {
  try {
    console.log(req.query.q);
    const search = req.query.q;
    const searchTerms = search.split(","); //","를 기준으로 나눔
    console.log("찾을 값", searchTerms);
    const findWhere = []; //검색 조건 저장할 배열
    for (let i = 0; i < searchTerms.length; i++) {
      const term = searchTerms[i];
      findWhere.push({
        [Op.or]: [
          { title: { [Op.like]: `%${term}%` } },
          { "$tags.tag_name$": { [Op.like]: `%${term}%` } },
        ],
      });
    }
    const parties = await Parties.findAll({
      include: [Tags, Amenities],
      where: {
        // title 또는 tag에서 검색어를 포함하는 경우 가져옵니다.
        [Op.or]: findWhere,
      },
    });
    const allTags = await Tags.findAll({
      attributes: ["tag_num", "tag_name", "tag_category", "tag_category_num"],
    });
    console.log("검색결과", parties);
    res.render("partiesSearch", { parties, allTags: allTags });
  } catch (error) {
    console.log(error);
  }
};
