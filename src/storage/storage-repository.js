import cloudinary from "../configs/cloudinary-config.js";

const uploadFile = async (fileDtoObj) => {
  try {
    const res = await cloudinary.uploader.upload(fileDtoObj.file, {
      ...fileDtoObj.options,
    });

    return res;
  } catch (e) {
    if (typeof e.code === "string") throw new Error(e.message);

    throw e;
  }
};

const previewFile = (fileDtoObj) =>
  cloudinary.url(fileDtoObj.publicId, {
    ...fileDtoObj.transformations,
  });

const url = (publicId, options) => cloudinary.url(publicId, options);

const getFilesByAssetFolder = async (folderPath) => {
  try {
    const res = await cloudinary.api.resources_by_asset_folder(folderPath);

    return res.resources;
  } catch (e) {
    if (typeof e.code === "string") throw new Error(e.message);

    throw e;
  }
};

const destroyFile = async (fileDTO) => {
  try {
    const res = await cloudinary.uploader.destroy(fileDTO.publicId, {
      resource_type: fileDTO.resourceType,
      type: fileDTO.deliveryType,
      invalidate: true,
    });

    return res;
  } catch (e) {
    if (typeof e.code === "string") throw new Error(e.message);

    throw e;
  }
};

const destroyFilesByFolder = async (folderPath) => {
  try {
    const files = await getFilesByAssetFolder(folderPath);

    return Promise.all(
      files.map(async (file) => {
        await destroyFile({
          publicId: file.public_id,
          resourceType: file.resource_type,
          deliveryType: file.type,
        });
      })
    );
  } catch (e) {
    if (typeof e.code === "string") throw new Error(e.message);

    throw e;
  }
};

export default {
  uploadFile,
  previewFile,
  url,
  destroyFilesByFolder,
};
