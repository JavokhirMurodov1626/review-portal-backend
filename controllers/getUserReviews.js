const { prisma } = require("../prismaClient");

const getUserReviews = async (req, res) => {
  try {
    const userId = req.body.id;

    const userReviews = await prisma.user.findUnique({
        where:{
            id:userId
        },
        select:{
            reviews:{
                select:{
                    id:true,
                    title:true,
                    product:true,
                    group:true,
                    rating:{
                        select:{
                            value:true
                        }
                    },
                    _count:{
                        select:{
                            likes:true,
                            rating:true
                        }
                    }
                },
            }
        }
      
    });

    res.status(201).json(userReviews);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


module.exports = {
    getUserReviews
};

