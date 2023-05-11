const { prisma } = require("../prismaClient");

const unlikeReview = async (req, res) => {
  try {

    const { authorId, reviewId } = req.body;

    await prisma.like.deleteMany({
      where: {
        authorId: authorId,
        reviewId: reviewId,
      },
    });

    res.status(201).json({
      message: "You unliked the review",
    });
  } catch (error) {
    res.status(400).json({
      error: error.message,
    });
  }
};

module.exports.unlikeReview = unlikeReview;
