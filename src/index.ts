import express from "express";
import cors from "cors";
import simpleGit from "simple-git";
import { generateId } from "./idGenerator";

const app = express();
app.use(cors());
app.use(express.json());

app.post("/deploy", async (req, res) => {
  const repoUrl = req.body.repoUrl;
  const id = generateId();
  await simpleGit().clone(repoUrl,`output/${id}`)
  console.log(repoUrl);

  res.json({});
});

app.listen(3000);
