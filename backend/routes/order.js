import express from 'express';
const router = express.Router();

import { authorizeRoles, isAthenticatedUser } from '../middleware/auth.js';
import { allOrders, deleteOrder, getOrderDetails, getSales, myOrders, newOrder, updateOrders } from '../controllers/orderController.js';
  
router.route("/neworder").post(isAthenticatedUser,newOrder);
router.route("/orders/:id").get(isAthenticatedUser,getOrderDetails);
router.route("/me/orders").get(isAthenticatedUser,myOrders);
 

router
.route("/admin/orders")
.get(isAthenticatedUser,authorizeRoles('admin'),allOrders);
 
router
.route("/admin/get_sales")
.get(isAthenticatedUser,authorizeRoles('admin'),getSales);

router
.route("/admin/orders/:id")
.put(isAthenticatedUser,authorizeRoles('admin'),updateOrders)
.delete(isAthenticatedUser,authorizeRoles('admin'),deleteOrder);
 
export default router;