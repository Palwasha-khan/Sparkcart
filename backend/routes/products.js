import express from 'express';
import { canUserReview, createProductReview, deleteProduct, deleteProductImage, deleteReview, getAdminProducts, getProductDeatils, getProductReview, getProducts, newProducts, updateProductDeatils, uploadProductImages } from '../controllers/productController.js';
import { authorizeRoles, isAthenticatedUser } from '../middleware/auth.js';
const router = express.Router();

router.route("/products").get(getProducts);
router.route("/product/:id").get(getProductDeatils);
router.route("/reviews")
        .get(isAthenticatedUser,getProductReview)
        .put(isAthenticatedUser,createProductReview);
router.route("/can_review")
        .get(isAthenticatedUser,canUserReview);

        //admin routes
router.route("/admin/products")
        .post(isAthenticatedUser, authorizeRoles("admin"),newProducts)
        .get(isAthenticatedUser, authorizeRoles("admin"),getAdminProducts);

router.route("/admin/product/:id/upload_images")
   .put(isAthenticatedUser, 
    authorizeRoles("admin"), 
    uploadProductImages
);
router.route("/admin/product/:id/delete_image")
   .put(isAthenticatedUser, 
    authorizeRoles("admin"), 
    deleteProductImage  
);
router.route("/admin/product/:id")
        .put(isAthenticatedUser, authorizeRoles("admin"),updateProductDeatils);
router.route("/admin/product/:id")
        .delete(isAthenticatedUser, authorizeRoles("admin"),deleteProduct);
router.route("/admin/reviews")
        .delete(isAthenticatedUser, authorizeRoles("admin"),deleteReview);


export default router;