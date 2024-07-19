import express from "express";
import { addUser, deleteUser, deleteUser1, getAll, getAllRole, getOne, updateUser } from "../controller/userController.js";
import verifyToken from "../middlewear/verify_token.js";
import { upload } from "../middlewear/cloudianary.config.js";
import { isAdmin } from "../middlewear/verify_role.js";
// import isAdmin from "../middlewear/verify_role.js";
const router = express.Router();
router.use(verifyToken)
router.get('/getone/:id_user', getOne)
router.post('/add',upload.single("avatar"), addUser)
router.use(verifyToken)
router.use(isAdmin)
router.get('/getall/role', getAllRole)
router.get('/getall', getAll)

router.put('/delete/:id_user',deleteUser);
router.put('/delete1/:id_user',deleteUser1);
router.put('/update/:id_user',upload.single("avatar"), updateUser);






export default router