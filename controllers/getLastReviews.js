const { prisma } = require("../prismaClient");

const getLastReviews = async (req, res) => {
  try {
    let currentDate = new Date();

    let aweekAgo = new Date();

    aweekAgo.setDate(aweekAgo.getDate() - 2);

    // get reviews that have been posted for last week
    const lastReviews = await prisma.review.findMany({
      where: {
        createdAt: {
          gte: aweekAgo,
          lte: currentDate,
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        title: true,
        description: true,
        author: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        product: {
          select: {
            id: true,
            name: true,
          },
        },
        group: true,
        tags: {
          select: {
            name: true,
          },
        },
        images: true,
        createdAt: true,
        rating: true
      },
    });
    
    const higherGradeReviews = await prisma.review.findMany({
      where: {
        productGrade: {
          gte: 8,
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        title: true,
        description: true,
        author: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        product: {
          select: {
            id: true,
            name: true,
          },
        },
        group: true,
        tags: {
          select: {
            name: true,
          },
        },
        images: {
          select:{
            imageUrl:true,
            filename:true
          }
        },
        createdAt: true,
        rating: true
      },
    });

    res.status(201).json({
      message: "LastReviews successfully rendered!",
      lastReviews,
      higherGradeReviews
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  getLastReviews,
};
