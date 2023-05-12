const { prisma } = require("../prismaClient");
const bucket = require("../config/gcs");

const deleteCloudImages = async (images) => {
  const deletedCloudImages = await Promise.all(
    images.map(async (image) => {
      const deleteOptions = {
        ifGenerationMatch: image.generation,
      };

      const deletedImage = await 
        bucket
        .file(image.filename)
        .delete(deleteOptions);

      return deletedImage;
    })
  );

  return deletedCloudImages;
};

const deleteUserReview = async (req, res) => {
  try {
    const reviewId = req.body.id;

    const reviewImages = await prisma.review.findUnique({
      where: {
        id: reviewId,
      },
      select: {
        images: true,
      },
    });

    // deleteImages from cloud
    // const deletedImages= await deleteCloudImages(reviewImages.images);

    const deletedReview = await prisma.review.delete({
      where: {
        id: reviewId,
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
  deleteUserReview,
  deleteCloudImages
};
