const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads'); // تخزين الصور في مجلد "uploads/"
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname); // إعادة تسمية الصورة
    }
});

exports.upload = multer({ storage: storage });

