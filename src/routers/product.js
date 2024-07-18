import express from "express";
import { getALlProductsOnSale,getProductByCategoryId,getProductByBrandId, addProduct, updateProduct, deleteProduct, getOneProduct, getALlProducts, getALlProductsDontSale, reStockProduct } from "../controller/productController.js";
import { upload } from "../middlewear/cloudianary.config.js";
import { isAdmin } from "../middlewear/verify_role.js";
import verifyToken from "../middlewear/verify_token.js";
const router = express.Router();



router.get("/getall",getALlProductsOnSale );

router.use(verifyToken)
router.get("/getone/:id_product",getOneProduct);
router.get("/getall/category/:id_category",getProductByCategoryId);
router.get("/getall/brand/:id_brand",getProductByBrandId);
// router.use(isAdmin)
router.get("/getall/all",getALlProducts );
router.get("/getall/dontsale",getALlProductsDontSale);
router.post("/add",upload.single("images") ,addProduct);
router.put("/update/:id_product",upload.single("images"),updateProduct);
router.put("/delete/:id_product",deleteProduct);
router.put('/restock/:id_product', reStockProduct);
export default router