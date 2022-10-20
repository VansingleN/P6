const fs = require('fs');
const multer = require('multer');

const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/gif' : 'gif'
};

const filesDestination = 'images'
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    if (!fs.existsSync(filesDestination)) {
      fs.mkdirSync(filesDestination)
    callback(null, 'images')
    }
    callback(null, 'images')
  },
  filename: (req, file, callback) => {
    const name = file.originalname.split(' ').join('_');
    const extension = MIME_TYPES[file.mimetype];
    callback(null, name + Date.now() + '.' + extension);
  }
})

module.exports = multer({storage: storage}).single('image')