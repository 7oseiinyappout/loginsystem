

const { S3Client, ListBucketsCommand } = require('@aws-sdk/client-s3');
require('dotenv').config();

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
  },
});

async function listBuckets() {
  try {
    const data = await s3.send(new ListBucketsCommand({}));
    console.log('s3 connection pass :', data.Buckets);
  } catch (err) {
    console.error('s3 connection fail :', err);
  }
}

listBuckets();
