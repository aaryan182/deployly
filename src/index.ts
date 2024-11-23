import express from "express";
import cors from "cors";
import simpleGit from "simple-git";
import path from "path";
import { generateId } from "./idGenerator";
import { getAllFiles } from "./file";
import { uploadFile } from "./cloudflareUpload";

const app = express();
app.use(cors());
app.use(express.json());

app.post("/deploy", async (req, res) => {
  const repoUrl = req.body.repoUrl;
  const id = generateId(); 
  const repoPath = path.join(__dirname, `output/${id}`);

  try {
    console.log(`Cloning repository: ${repoUrl} into ${repoPath}`);
    await simpleGit().clone(repoUrl, repoPath); 

    console.log("Fetching all files...");
    const files = getAllFiles(repoPath); 

    console.log(`Found ${files.length} files. Starting upload...`);

    await Promise.all(
      files.map(async (relativePath) => {
        const absolutePath = path.join(repoPath, relativePath); 
        const fileKey = path.join("output", id, relativePath);
        console.log(`Uploading: ${fileKey}`);
        await uploadFile(fileKey, absolutePath); 
      })
    );

    console.log("All files uploaded successfully.");
    res.json({ id });
  } catch (error) {
    console.error("Error during deployment:", error);
    res
      .status(500)
      .json({ error: "Deployment failed" });
  }
});

app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
