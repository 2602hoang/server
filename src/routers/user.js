import express from "express";
import { addUser, deleteUser, getAll, getAllRole, getOne } from "../controller/userController.js";
import verifyToken from "../middlewear/verify_token.js";
import { upload } from "../middlewear/cloudianary.config.js";
const router = express.Router();

// router.use(verifyToken)
router.get('/getall/role', getAllRole)
router.get('/getall', getAll)
router.get('/getone/:id_user', getOne)
router.post('/add',upload.single("avatar"), addUser)
router.put('/delete/:id_user',deleteUser);


export default router