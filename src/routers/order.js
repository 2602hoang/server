import express  from "express";
import { addNoteOrder, createOrder, finishedOrderHuy, finishedOrderThanhCong, finishedOrderThatBai, getAllOrders, getAllOrdersbyIdpay, getAllOrdersbyIduser, getOneOrderPay, getOneOrderPaybyUserID, getOrderByOrderId, getOrderByStatus, getOrderByUserIdandOrderId, getOrderFinished, getOrderPay, updateOrderbyIdpay, updateOrderbyIdpayhuy, updatepayOrderBypayIdandStatus,  } from "../controller/orderController.js";
const router = express.Router();
router.post("/add", createOrder);
router.get("/getall", getAllOrders);

router.get('/getall/user/:id_user',getAllOrdersbyIduser);





router.get("/getonebyOrderId/:id_order",getOrderByOrderId);

router.get("/getone/:id_user&:id_order", getOrderByUserIdandOrderId);


router.get("/getall/status1",getOrderPay);

router.get("/getone1/status1/:id_user",getOneOrderPaybyUserID);



router.get("/getall/status1/idpay25",getOrderFinished);

router.get("/status/0/:id_user",getOrderByStatus);


// sau khi xac nhan thanh toan
router.get("/getone/status1/:id_user&:id_order",getOneOrderPay);


router.get('/getall/byidpay/:id_pay',getAllOrdersbyIdpay);




router.put("/pay/:id_order",updatepayOrderBypayIdandStatus);
router.put("/update/xacnhan/:id_order",updateOrderbyIdpay);
router.put('/update/huy/:id_order', updateOrderbyIdpayhuy);


router.put("/add/note/:id_order",addNoteOrder);

router.put('/finished2/:id_order',finishedOrderThanhCong);

router.put('/finished5/:id_order',finishedOrderHuy);

router.put('/finished3/:id_order',finishedOrderThatBai);


export default router