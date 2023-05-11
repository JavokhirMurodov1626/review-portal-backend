const { prisma } = require("../prismaClient");

const getReview = async (req, res) => {
  try {
    const reviewId = req.body.id;
    const selectedReview = await prisma.review.findUnique({
      where: {
        id: reviewId,
      },
      include: {
        author: {
          select:{
            name:true,
            image:true,
          }
        },
        product: {
          select:{
            name:true
          }
        },
        tags: true,
        rating:true,
        likes:true,
        comments:{
          select:{
            author:{
              select:{
                name:true,
                image:true
              }
            },
            content:true,
            createdAt:true
          }
        }
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
  getReview,
};
