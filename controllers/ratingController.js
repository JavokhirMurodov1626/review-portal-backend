const { prisma } = require("../prismaClient");

const addRating = async (req, res) => {
  try {
    const { text, rate, authorId, reviewId } = req.body;

    let existingRating = await prisma.rating.findFirst({
      where: {
        authorId,
        reviewId,
      },
    });

    if (existingRating) {
      await prisma.rating.updateMany({
        where: {
          authorId,
          reviewId,
        },
        data: {
          value: rate,
        },
      });
    } else {
      // if there is no such rating create new one and assign it to existingRating variable
      existingRating = await prisma.rating.create({
        data: {
          value: rate,
          author: { connect: { id: authorId } },
          review: { connect: { id: reviewId } },
        },
      });
    }
    // existingRating = await prisma.rating.findFirst({
    //   where: {
    //     authorId,
    //     reviewId,
    //   },
    // });

    const newComment = await prisma.comment.create({
      data: {
        content: text,
        author: { connect: { id: authorId } },
        review: { connect: { id: reviewId } },
      },
    });

    res.status(201).json({
      message: "successfully submitted",
      rating: existingRating,
      comment: newComment,
    });
  } catch (error) {
    res.status(400).json({
      error: error.message,
    });
  }
};

module.exports.addRating = addRating;
