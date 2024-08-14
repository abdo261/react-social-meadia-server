const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');  

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '/images/posts'));  
  },
  filename: (req, file, cb) => {
    const uniqueId = uuidv4();  
    const extension = path.extname(file.originalname);
    const uniqueName = `${uniqueId}${extension}`;  
    cb(null, uniqueName);  
  }
});


const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true); 
  } else {
    cb(new Error('Only image files are allowed'), false); 
  }
};

const upload = multer({ storage, fileFilter });

module.exports = upload;
