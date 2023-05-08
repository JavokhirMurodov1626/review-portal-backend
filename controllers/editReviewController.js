const { prisma } = require("../prismaClient");

const editReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { title, content } = req.body;
    const { id: authorId } = req.user;

    const review = await prisma.review.findUnique({
      where: { id: Number(reviewId) },
    });

    if (!review) {
      return res.status(404).json({
        status: "error",
        message: "Review not found",
      });
    }

    if (review.authorId !== authorId) {
      return res.status(403).json({
        status: "error",
        message: "You do not have permission to edit this review",
      });
    }

    const updatedReview = await prisma.review.update({
      where: { id: Number(reviewId) },
      data: { title, content },
    });

    res.status(200).json({
      status: "success",
      data: {
        review: updatedReview,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};

module.exports.editReview = editReview;
