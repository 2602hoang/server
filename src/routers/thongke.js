import express from "express";
import {
  thongkeHuy,
  thongkeOrderbyUser,
  thongkeProductbyStock,
  thongkeProductnoSales,
  thongkeProductSales,
  thongkeThanhCong,
  thongkeThatbai,
  thongkeUsers,
} from "../controller/thongkeController.js";
import { isAdmin } from "../middlewear/verify_role.js";
import verifyToken from "../middlewear/verify_token.js";
const router = express.Router();

//thống kê product tồn kho nhỏ hơn 30
//
router.use(verifyToken);
router.use(isAdmin);
router.get("/product/stock", thongkeProductbyStock);
router.get("/product/sales", thongkeProductSales);
router.get("/product/nosales", thongkeProductnoSales);

router.get("/order/thanhcong", thongkeThanhCong);
router.get("/order/huy", thongkeHuy);
router.get("/order/thatbai", thongkeThatbai);
router.get("/user/all", thongkeUsers);

//3 user nhiều đơn nhâtf
// /user/order/3?startDate=2024-07-10'
router.get("/user/order/3", thongkeOrderbyUser);

export default router;
