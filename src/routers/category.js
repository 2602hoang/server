import express from "express";
import { getAllCategories } from "../controller/categoryController.js";
const router = express.Router();
router.get("/getall", getAllCategories);
export default router