import express from "express";
import { getALlProducts } from "../controller/productController.js";

const router = express.Router();

router.get("/getall",getALlProducts);
export default router