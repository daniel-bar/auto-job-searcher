import express from "express";

import { main } from "../controller/main";

const router = express.Router();

router.post("/", main);

export default router;
