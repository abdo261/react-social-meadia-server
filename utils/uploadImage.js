const path = require('path');

/**
 * Constructs the file path for the uploaded image.
 * @param {string} filename - The name of the uploaded file.
 * @returns {string} - The relative path of the saved image.
 */
const getImagePath = (filename) => {
  return path.join('images/posts', filename);
};

module.exports = getImagePath;
