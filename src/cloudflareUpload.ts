import { S3 } from "aws-sdk";
import fs from "fs";

const s3 = new S3({
  accessKeyId: "d22d0abd22fc5b09887b936fe7cf687e",
  secretAccessKey:
    "bbe6d8b28b414a0cbfd98ed51b317d9c51cfadc83d551f52018a3a2b5492332b",
  endpoint: "https://198a5de935e581b753ddad2f2c076991.r2.cloudflarestorage.com",
});

export const uploadFile = async (fileKey: string, localFilePath: string) => {
  try {
    const fileContent = fs.readFileSync(localFilePath);
    const response = await s3
      .upload({
        Body: fileContent,
        Bucket: "deployly", 
        Key: fileKey, 
      })
      .promise();
    console.log(`Uploaded: ${fileKey}`);
    return response;
  } catch (error) {
    console.error(`Failed to upload ${fileKey}:`, error);
    throw error;
  }
};
