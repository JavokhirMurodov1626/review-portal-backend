const { prisma } = require("../prismaClient");

const likeReview = async (req, res) => {
  try {
    const { authorId, reviewId } = req.body;

    // let existingLike = prisma.like.findFirst({
    //   where: {
    //     authorId: authorId,
    //     reviewId: reviewId,
    //   },
    // });
    // let existingRating = await prisma.rating.findFirst({
    //     where: {
    //       authorId,
    //       reviewId,
    //     },
    //   });

    await prisma.like.create({
    data: {
        author: { connect: { id: authorId } },
        review: { connect: { id: reviewId } },
    },
    });
    
    res.status(201).json({
      message: "You liked the review",
    });
  } catch (error) {
    res.status(400).json({
      error: error.message,
    });
  }
};

module.exports.likeReview = likeReview;
