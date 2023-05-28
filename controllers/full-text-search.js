const { prisma } = require("../prismaClient");
const stringSimilarity = require("string-similarity");

const getSearchedReview = async (req, res) => {
  let searchQuery = req.body.queryString;

  try {
    const allReviews = await prisma.review.findMany({
      select: {
        id: true,
        title: true,
      },
    });
    
    const searchResults = allReviews.map((review) => {
      let similarity = stringSimilarity.compareTwoStrings(
        searchQuery.toLowerCase(),
        review.title.toLowerCase()
      );
      similarity=similarity*100;
      return { ...review, similarity:similarity.toFixed(1) };
    });

    const searchedReviews = searchResults.filter(
      (result) => result.similarity > 50
    );
    
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

// const { prisma } = require("../prismaClient");

// const getSearchedReview = async (req, res) => {
//   let searchQuery = req.body.queryString;

//   const searchTerms = searchQuery.split(" ");

//   try {
//     const searchedReviews = await prisma.review.findMany({
//       where: {
//         OR: searchTerms.map((term) => ({
//           OR: [
//             { title: { 
//                 contains: term,
//                 mode: 'insensitive'}
//             },
//             { description: 
//                 { contains: term,mode: 'insensitive'}
//             },
//             { content: 
//                 { contains: term, mode: 'insensitive'}
//             },
//             { tags: 
//                 { some: 
//                     { name: 
//                         { contains: term,mode: 'insensitive'}
//                     } 
//                 } 
//             },
//             { product: 
//                 { name: 
//                     { contains: term,  mode: 'insensitive' } 
//                 } 
//             },
//             { group: 
//                 { contains: term,  mode: 'insensitive' }  
//             },
//           ],
//         })),
//       },
//       select: {
//         id: true,
//         title: true,
//       },
//     });

//     res.status(200).json({
//       reviews: searchedReviews,
//     });
//   } catch (error) {
//     console.log(error);
//     res.status(400).json({ error: error.message });
//   }
// };

// module.exports = {
//   getSearchedReview,
// };
