import express from "express";

import cors from "cors";

import swaggerUi from "swagger-ui-express";

import authRoutes from "./routes/AuthRoutes.js";
import postsRoutes from "./routes/PostsRoutes.js";
import usersRoutes from "./routes/UsersRoutes.js";
import followersRoutes from "./routes/FollowersRoutes.js";
import filesRoutes from "./routes/FilesRoutes.js";
import openApiSpecs from "./docs/openapi.json" assert { type: "json" };

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("./docs"));
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(openApiSpecs));

app.get("/api/", (req, res) => {
  res.send("Hello world. The API is up and running");
});
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/posts", postsRoutes);
app.use("/api/v1/users", usersRoutes);
app.use("/api/v1/users", followersRoutes);
app.use("/api/v1/files", filesRoutes);

export default app;
