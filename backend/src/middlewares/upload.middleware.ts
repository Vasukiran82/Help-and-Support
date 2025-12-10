import multer from "multer";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";
import stream from "stream";
import { Request } from "express";

const s3 = new S3Client({ region: process.env.AWS_REGION });

const bucket = process.env.S3_BUCKET_NAME || "";

const storage = multer.memoryStorage();
export const upload = multer({ storage });

export const uploadToS3 = async (file: Express.Multer.File) => {
  if (!file) return null;
  const key = `support/${Date.now()}-${uuidv4()}-${file.originalname}`;
  const params = {
    Bucket: bucket,
    Key: key,
    Body: file.buffer,
    ContentType: file.mimetype,
  };
  await s3.send(new PutObjectCommand(params));
  // return public url (make sure bucket policy allows public read or use presigned url)
  const url = `https://${bucket}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
  return { url, key };
};
