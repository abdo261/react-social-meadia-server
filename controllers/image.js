const path = require('path');
const fs = require('fs');

/**
 * Serve an image by its filename.
 * @param {Object} req - The request object containing the filename in the URL params.
 * @param {Object} res - The response object.
 */
const getImage = (req, res) => {
  const { filename } = req.params;  // Extract filename from URL params
  const imagePath = path.join(__dirname, '../images/posts', filename);  // Construct full image path

  fs.stat(imagePath, (err, stats) => {
    if (err || !stats.isFile()) {
      return res.status(404).json({ message: 'Image not found.' });  // Return 404 if image does not exist
    }

    res.sendFile(imagePath);  // Serve the image file
  });
};

const deleteOldImages = (imageFiles) => {
  imageFiles.forEach((filename) => {
    const filePath = path.join(__dirname, '../images/posts', filename);
    fs.unlink(filePath, (err) => {
      if (err) {
        console.error(`Failed to delete image ${filename}: ${err.message}`);
      }
    });
  });
};

module.exports = {
  getImage,deleteOldImages
};
