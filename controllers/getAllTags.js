const { prisma } = require("../prismaClient");

const getAllTags = async (req, res) => {
  try {

    const tags= await prisma.tag.findMany({});

    res.status(201).json({
      tags
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  getAllTags,
};
