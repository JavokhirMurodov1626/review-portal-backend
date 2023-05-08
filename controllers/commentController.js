const { prisma } = require("../prismaClient");

const addComment = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { content } = req.body;
    const { id: authorId } = req.user;

    const newComment = await prisma.comment.create({
      data: {
        content,
        author: { connect: { id: authorId } },
        review: { connect: { id: Number(reviewId) } },
      },
    });

    res.status(201).json({
      status: "success",
      data: {
        comment: newComment,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};

module.exports.addComment = addComment;
