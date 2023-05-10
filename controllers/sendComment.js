const { prisma } = require("../prismaClient");

const sendComment = async (req, res) => {
  try {

    const { content,authorId,reviewId} = req.body;

    const newComment = await prisma.comment.create({
      data: {
        content: content,
        author: { connect: { id: authorId } },
        review: { connect: { id: reviewId } },
      },
    });

    res.status(201).json(newComment);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  sendComment,
};
