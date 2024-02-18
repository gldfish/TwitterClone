import express from "express";

import fs from "fs";
import path from "path";
const router = express.Router();

router.get("/", (req, res) => {
  const rootFolder =
    process.env.NODE_ENV === "development" ? "../TEMP" : "/tmp";
  const AUTH_FILE_PATH = path.join(rootFolder, "AUTH.json");
  const POSTS_FILE_PATH = path.join(rootFolder, "POSTS.json");
  const USERS_FILE_PATH = path.join(rootFolder, "USERS.json");
  const authFile = fs.readFileSync(AUTH_FILE_PATH, "utf-8");
  const postsFile = fs.readFileSync(POSTS_FILE_PAT, "utf-8");
  const usersFile = fs.readFileSync(USERS_FILE_PATH, "utf-8");
  return res.json({
    authFile: JSON.parse(authFile) ?? "EMPTY",
    postsFile: JSON.parse(postsFile) ?? "EMPTY",
    usersFile: JSON.parse(usersFile) ?? "EMPTY",
  });
});


export default router