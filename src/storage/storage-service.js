import storageRepository from "./storage-repository.js";

const upload = async (fileDtoObj) => storageRepository.uploadFile(fileDtoObj);

const preview = (fileDtoObj) => storageRepository.previewFile(fileDtoObj);

export default {
  upload,
  preview,
};
