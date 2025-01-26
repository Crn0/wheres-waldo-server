import cloudinary from "../configs/cloudinary-config.js";
import StorageError from "../errors/storage-error.js";

const uploadFile = async (fileDtoObj) => {
  try {
    const res = await cloudinary.uploader.upload(fileDtoObj.file, {
      ...fileDtoObj.options,
    });

    return res;
  } catch (e) {
    if (e instanceof StorageError) throw e;

    if (typeof e.code === "string") throw new Error(e.message);

    throw e;
  }
};

const previewFile = (fileDtoObj) =>
  cloudinary.url(fileDtoObj.publicId, {
    ...fileDtoObj.transformations,
  });

export default {
  uploadFile,
  previewFile,
};
