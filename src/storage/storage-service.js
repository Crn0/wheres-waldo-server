import storageRepository from "./storage-repository.js";

const upload = async (fileDtoObj) => storageRepository.uploadFile(fileDtoObj);

const preview = (fileDtoObj) => storageRepository.previewFile(fileDtoObj);

const generateURL = (publicId, options) =>
  storageRepository.url(publicId, options);

export default {
  upload,
  preview,
  generateURL,
};
