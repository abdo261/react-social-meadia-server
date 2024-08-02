const { getImage } = require('../controllers/image');

const imageRouter = require('express').Router()

imageRouter.get('/:filename', getImage);
module.exports = imageRouter