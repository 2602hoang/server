import express from "express";
import { getALlProducts,getProductByCategoryId,getProductByBrandId, addProduct, updateProduct, deleteProduct, getOneProduct } from "../controller/productController.js";
import { upload } from "../middlewear/cloudianary.config.js";
const router = express.Router();

router.get("/getall",getALlProducts);
router.get("/getone/:id_product",getOneProduct);
router.get("/getall/category/:id_category",getProductByCategoryId);
router.get("/getall/brand/:id_brand",getProductByBrandId);

router.post("/add",upload.single("images") ,addProduct);

router.put("/update/:id_product",upload.single("images"),updateProduct);
router.put("/delete/:id_product",deleteProduct);
export default router