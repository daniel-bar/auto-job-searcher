import express from "express";
import path from "path";

import router from "./router/main";

const app: express.Application = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  (req: express.Request, res: express.Response, next: express.NextFunction) => {
    res.setHeader("Access-Control-Allow-Origin", process.env.HTTP_ACCESS_IP);
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    res.setHeader(
      "Access-Control-Allow-Methods",
      "OPTIONS, GET, POST, PATCH, DELETE, PUT"
    );
    next();
  }
);

app.get(
  "/alive",
  (req: express.Request, res: express.Response, next: express.NextFunction) =>
    res.status(200).send("Data server is alive")
);

app.use("/", router);

export default app;
