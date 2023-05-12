const { prisma } = require("../prismaClient");
const bucket = require("../config/gcs");
const { deleteCloudImages } = require("./deleteUserReview");

const updateImages = async (base64Images, images) => {
  const previousImages = [...images];

  let deletedReviewImages = [...images];

  let unchangedReviewImages = [];

  const uploadedImageUrls = await Promise.all(
    base64Images.map(async (base64String) => {
      // check if image is new
      if (base64String.startsWith("data:image")) {
        const data = base64String.replace(/^.*;base64,/, "");

        const fileBuffer = Buffer.from(data, "base64");

        const { getFileTypeFromBuffer } = await import("../fileTypeHelper.mjs");

        const fileTypeResult = await getFileTypeFromBuffer(fileBuffer);

        if (!fileTypeResult) {
          throw new Error("Unable to determine file type from buffer");
        }

        const { ext, mime } = fileTypeResult;

        const filename = `${Date.now()}.${ext}`;

        const file = bucket.file(filename);

        await file.save(fileBuffer, {
          metadata: {
            contentType: mime,
          },
        });

        await file.makePublic();

        const [metadata] = await file.getMetadata();

        const generation = metadata.generation;

        const imageUrl = `https://storage.googleapis.com/${process.env.GCLOUD_BUCKET_NAME}/${filename}`;

        return { imageUrl, filename, generation };
      } else if (base64String.startsWith("https://storage.googleapis.com")) {
        deletedReviewImages = deletedReviewImages.filter(
          (image) => image.imageUrl !== base64String
        );

        previousImages.map((image) => {
          if (image.imageUrl == base64String) {
            unchangedReviewImages.push(image);
          }
        });

        return;
      }
    })
  );

  return {
    createdReviewImages: uploadedImageUrls,
    unchangedReviewImages,
    deletedReviewImages,
  };
};

const editReview = async (req, res) => {
  try {
    const {
      reviewId,
      authorId,
      title,
      productName,
      description,
      productGrade,
      productGroup,
      tags,
      content,
      images,
      previousImages,
    } = req.body;

    const { deletedReviewImages, unchangedReviewImages, createdReviewImages } =
      await updateImages(images, previousImages);

    let product = await prisma.product.findUnique({
      where: { name: productName },
    });

    //if there is no such product
    if (!product) {
      product = await prisma.product.create({
        data: {
          name: productName,
        },
      });
    }

    const existingTags = await prisma.tag.findMany({
      where: { name: { in: tags } },
    });

    let newTags = [];

    if (existingTags.length == 0) {
      newTags = await Promise.all(
        tags.map(async (tagName) => {
          return await prisma.tag.create({
            data: {
              name: tagName,
            },
          });
        })
      );
    } else {
      // extracting stored tag names
      const existingTagNames = existingTags.map((tag) => tag.name);
      // find new added tags
      const newTagNames = tags.filter(
        (tagName) => !existingTagNames.includes(tagName)
      );

      newTags = await Promise.all(
        newTagNames.map(async (tagName) => {
          return await prisma.tag.create({
            data: {
              name: tagName,
            },
          });
        })
      );
    }

    const allTags = [...existingTags, ...newTags];

    const review = await prisma.review.update({
      where: {
        id: reviewId,
      },
      data: {
        title,
        author: { connect: { id: authorId } },
        description,
        product: { connect: { id: product.id } },
        group: productGroup,
        tags: {
          connect: allTags.map((tag) => ({ id: tag.id })),
        },
        content,
        images: {
          connect: unchangedReviewImages.map((image) => ({ id: image.id })),
          create: createdReviewImages.map((image) => {
            if (image) {
              return {
                imageUrl: image.imageUrl,
                filename: image.filename,
                generation: image.generation,
              };
            }
          }),
        },
        productGrade,
      },
      include: {
        author: true,
        product: true,
        tags: true,
      },
    });

    //deleting images from cloud
    await deleteCloudImages(deletedReviewImages);

    //deleteing from database
    await Promise.all(
      deletedReviewImages.map(async (image) => {
        await prisma.image.deleteMany({
          where: {
            generation: image.generation,
          },
        });
      })
    );

    res.status(201).json({ message: "Review is uccessfully updated!", review });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports.editReview = editReview;
