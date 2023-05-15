const { prisma } = require("../prismaClient");

const getSearchedReview = async (req, res) => {
  let searchQuery = req.body.queryString;

  const searchTerms = searchQuery.split(" ");

  try {
    const searchedReviews = await prisma.review.findMany({
      where: {
        OR: searchTerms.map((term) => ({
          OR: [
            { title: { 
                contains: term,
                mode: 'insensitive'}
            },
            { description: 
                { contains: term,mode: 'insensitive'}
            },
            { content: 
                { contains: term, mode: 'insensitive'}
            },
            { tags: 
                { some: 
                    { name: 
                        { contains: term,mode: 'insensitive'}
                    } 
                } 
            },
            { product: 
                { name: 
                    { contains: term,  mode: 'insensitive' } 
                } 
            },
            { group: 
                { contains: term,  mode: 'insensitive' }  
            },
          ],
        })),
      },
      select: {
        id: true,
        title: true,
      },
    });

    res.status(200).json({
      reviews: searchedReviews,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  getSearchedReview,
};
