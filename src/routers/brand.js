import express from "express";
import { getALlBrands } from "../controller/brandController.js";
const router = express.Router();
router.get("/getall", getALlBrands);
export default router