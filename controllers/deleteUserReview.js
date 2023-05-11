const { prisma } = require("../prismaClient");

const deleteUserReview = async (req, res) => {
  try {
    const reviewId = req.body.id;

    const deletedReview = await prisma.review.delete({
        where:{
            id:reviewId
        },
        select:{
            id:true
        }
    });

    res.status(201).json(deletedReview);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


module.exports = {
    deleteUserReview
};

