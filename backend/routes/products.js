import express from 'express';
import { canUserReview, createProductReview, deleteProduct, deleteReview, getProductDeatils, getProductReview, getProducts, newProducts, updateProductDeatils } from '../controllers/productController.js';
import { authorizeRoles, isAthenticatedUser } from '../middleware/auth.js';
const router = express.Router();

router.route("/products").get(getProducts);
router.route("/admin/products")
        .post(isAthenticatedUser, authorizeRoles("admin"),newProducts);
router.route("/product/:id").get(getProductDeatils);
router.route("/admin/product/:id")
        .put(isAthenticatedUser, authorizeRoles("admin"),updateProductDeatils);
router.route("/admin/product/:id")
        .delete(isAthenticatedUser, authorizeRoles("admin"),deleteProduct);

router.route("/reviews")
.get(isAthenticatedUser,getProductReview)
.put(isAthenticatedUser,createProductReview);
router.route("/can_review")
.get(isAthenticatedUser,canUserReview);

router.route("/admin/reviews")
        .delete(isAthenticatedUser, authorizeRoles("admin"),deleteReview);


export default router;