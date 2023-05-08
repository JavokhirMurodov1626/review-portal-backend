const { prisma } = require("../prismaClient");

const deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
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
        message: "You do not have permission to delete this review",
      });
    }

    await prisma.review.delete({
      where: { id: Number(reviewId) },
    });

    res.status(204).json({
      status: "success",
      data: null,
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};

module.exports.deleteReview = deleteReview;
