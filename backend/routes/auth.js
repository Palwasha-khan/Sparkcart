import express from 'express';
import { allUsers, deleteUser, getUserDetail, getUserProfile, loginUser, logoutUser, registerUser, updatePassword, updateProfile, updateUser } from '../controllers/authController.js';
 const router = express.Router();
 import { isAthenticatedUser } from '../middleware/auth.js';
import { getProductDeatils } from '../controllers/productController.js';

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").get(logoutUser);
 
router.route("/me").get(isAthenticatedUser,getUserProfile);
router.route("/password/update").put(isAthenticatedUser,updatePassword);
router.route("/me/update").put(isAthenticatedUser,updateProfile);
 
router
 .route("/admin/users").get(isAthenticatedUser,allUsers);
router
.route("/admin/users/:id")
 .get(isAthenticatedUser,getUserDetail)
 .put(isAthenticatedUser,updateUser)
 .delete(isAthenticatedUser,deleteUser);;
 
export default router;