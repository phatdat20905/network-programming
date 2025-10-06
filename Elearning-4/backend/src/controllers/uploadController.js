import apiResponse from '../utils/apiResponse.js';

const uploadController = {
  // Upload single image
  uploadImage: async (req, res) => {
    try {
      if (!req.file) {
        return apiResponse.error(res, 'No file uploaded', 400);
      }

      apiResponse.success(res, 'Image uploaded successfully', {
        filename: req.file.filename,
        path: `/uploads/${req.file.filename}`,
        url: `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`,
        size: req.file.size,
        mimetype: req.file.mimetype
      });

    } catch (error) {
      console.error('Upload image error:', error);
      apiResponse.error(res, 'Failed to upload image', 500);
    }
  },

  // Upload multiple images
  uploadMultipleImages: async (req, res) => {
    try {
      if (!req.files || req.files.length === 0) {
        return apiResponse.error(res, 'No files uploaded', 400);
      }

      const uploadedFiles = req.files.map(file => ({
        filename: file.filename,
        path: `/uploads/${file.filename}`,
        url: `${req.protocol}://${req.get('host')}/uploads/${file.filename}`,
        size: file.size,
        mimetype: file.mimetype
      }));

      apiResponse.success(res, 'Images uploaded successfully', {
        files: uploadedFiles,
        count: uploadedFiles.length
      });

    } catch (error) {
      console.error('Upload multiple images error:', error);
      apiResponse.error(res, 'Failed to upload images', 500);
    }
  }
};

export default uploadController;