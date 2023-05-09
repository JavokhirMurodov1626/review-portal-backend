const { prisma } = require("../prismaClient");

const getComments = async (req, res) => {
  try {
    const reviewId = req.body.id;
    const selectedReview = await prisma.review.findFirst({
      where: {
        id: reviewId,
      },
      include: {
        author: true,
        product: true,
        tags: true,
        rating:true,
        likes:true
      },
    });

    res.status(201).json({
      message: "Selected Review successfully rendered!",
      review: selectedReview,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  getComments
};
