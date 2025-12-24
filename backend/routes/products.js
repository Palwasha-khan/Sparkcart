import express from 'express';
import { deleteProduct, getProductDeatils, getProducts, newProducts, updateProductDeatils } from '../controllers/productController.js';
const router = express.Router();

router.route("/products").get(getProducts);
router.route("/admin/products").post(newProducts);
router.route("/product/:id").get(getProductDeatils);
router.route("/product/:id").put(updateProductDeatils);
router.route("/product/:id").delete(deleteProduct);

export default router;