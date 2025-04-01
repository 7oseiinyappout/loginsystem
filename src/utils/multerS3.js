const multer = require('multer');
const { S3Client } = require('@aws-sdk/client-s3');
const multerS3 = require('multer-s3');
require('dotenv').config();

// إنشاء عميل S3 باستخدام AWS SDK v3
const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SERET_KEY,
  },
});

// إعداد multer-s3 لرفع الملفات إلى S3 مباشرة
exports.multerS3 = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.AWS_BUCKET_NAME,
    metadata: (req, file, cb) => {
      cb(null, { fieldName: file.fieldname });
    },
    key: (req, file, cb) => {
      const fileName = `uploads/${Date.now()}-${file.originalname}`;
      cb(null, fileName);
    },
    contentType: multerS3.AUTO_CONTENT_TYPE, // تعيين نوع المحتوى تلقائيًا
  }),
  limits: { fileSize: 5 * 1024 * 1024 }, // تحديد الحد الأقصى للحجم (5MB)
});

