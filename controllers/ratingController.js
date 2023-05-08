const { prisma } = require('../prismaClient');

const addRating = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { value } = req.body;
    const { id: authorId } = req.user;

    const existingRating = await prisma.rating.findFirst({
      where: {
        authorId,
        reviewId: Number(reviewId),
      },
    });

    if (existingRating) {
      return res.status(400).json({
        status: "error",
        message: "You have already rated this review.",
      });
    }

    const newRating = await prisma.rating.create({
      data: {
        value: Number(value),
        author: { connect: { id: authorId } },
        review: { connect: { id: Number(reviewId) } },
      },
    });

    res.status(201).json({
      status: "success",
      data: {
        rating: newRating,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};

module.exports.addRating = addRating;
