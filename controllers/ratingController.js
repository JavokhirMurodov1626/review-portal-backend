const { prisma } = require("../prismaClient");

const addRating = async (req, res) => {
  try {
    const { value, authorId, reviewId } = req.body;
    let existingRating = await prisma.rating.findFirst({
      where: {
        authorId,
        reviewId,
      },
    });

    if (existingRating && value > 0) {
      await prisma.rating.updateMany({
        where: {
          authorId,
          reviewId,
        },
        data: {
          value: value,
        },
      });
    } else {
      // if there is no such rating create new one and assign it to existingRating variable
      existingRating = await prisma.rating.create({
        data: {
          value: value,
          author: { connect: { id: authorId } },
          review: { connect: { id: reviewId } },
        },
      });
    }

    res.status(201).json(existingRating);
  } catch (error) {
    res.status(400).json({
      error: error.message,
    });
  }
};

module.exports.addRating = addRating;
