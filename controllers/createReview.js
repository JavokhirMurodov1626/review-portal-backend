const { prisma } = require("../prismaClient");
const bucket = require("../config/gcs");

const uploadImages = async (base64Images) => {
  const uploadedImageUrls = await Promise.all(
    base64Images.map(async (base64String) => {
      // Extract base64 data from the base64 string
      const data = base64String.replace(/^.*;base64,/, "");

      // A buffer containing the raw binary data of the image
      const fileBuffer = Buffer.from(data, "base64");

      // Determine the file extension and content type using the fileTypeHelper module
      const { getFileTypeFromBuffer } = await import("../fileTypeHelper.mjs");

      const fileTypeResult = await getFileTypeFromBuffer(fileBuffer);

      if (!fileTypeResult) {
        throw new Error("Unable to determine file type from buffer");
      }

      const { ext, mime } = fileTypeResult;

      // Generate a unique filename for the image
      const filename = `${Date.now()}.${ext}`;

      // Create a reference to the file in the bucket
      const file = bucket.file(filename);

      // Upload the image to Google Cloud Storage
      await file.save(fileBuffer, {
        metadata: {
          contentType: mime,
        },
      });

      await file.makePublic();

      const [metadata] = await file.getMetadata();

      const generation = metadata.generation;

      // Generate a public URL for the uploaded image
      const imageUrl = `https://storage.googleapis.com/${process.env.GCLOUD_BUCKET_NAME}/${filename}`;

      return { imageUrl, filename, generation };
    })
  );

  return uploadedImageUrls;
};

const createReview = async (req, res) => {
  try {
    const {
      authorId,
      title,
      productName,
      description,
      productGrade,
      productGroup,
      tags,
      content,
      images,
    } = req.body;

    const cloudImages = await uploadImages(images);

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

    const review = await prisma.review.create({
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
          create: cloudImages.map((image) => ({
            imageUrl: image.imageUrl,
            filename: image.filename,
            generation: image.generation,
          })),
        },
        productGrade,
      },
      include: {
        author: true,
        product: true,
        tags: true,
      },
    });

    res.status(201).json({ message: "Review is uccessfully created!", review });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  createReview,
};
