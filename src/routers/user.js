import express from "express";
import { addUser, deleteUser, getAll, getAllRole, getOne, updateUser } from "../controller/userController.js";
import verifyToken from "../middlewear/verify_token.js";
import { upload } from "../middlewear/cloudianary.config.js";
import { isAdmin } from "../middlewear/verify_role.js";
// import isAdmin from "../middlewear/verify_role.js";
const router = express.Router();
router.get('/getone/:id_user', getOne)

router.use(verifyToken)
router.use(isAdmin)
router.post('/add',upload.single("avatar"), addUser)
router.put('/delete/:id_user',deleteUser);
router.put('/update/:id_user',upload.single("avatar"), updateUser);

router.get('/getall/role', getAllRole)
router.get('/getall', getAll)




export default router