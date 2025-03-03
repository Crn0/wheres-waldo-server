import storageRepository from "./storage-repository.js";

const upload = async (fileDtoObj) => storageRepository.uploadFile(fileDtoObj);

const preview = (fileDtoObj) => storageRepository.previewFile(fileDtoObj);

const generateURL = (publicId, options) =>
  storageRepository.url(publicId, options);

const destroyFilesByFolder = (folderPath) =>
  storageRepository.destroyFilesByFolder(folderPath);

export default {
  upload,
  preview,
  generateURL,
  destroyFilesByFolder,
};
