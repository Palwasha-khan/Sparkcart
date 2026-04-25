import express from 'express';
const router = express.Router();
import { isAthenticatedUser } from '../middleware/auth.js';
import { stripeCheckoutSession, stripeWebhook } from '../controllers/paymentController.js';


router.route("/payment/checkout_session").post(isAthenticatedUser, stripeCheckoutSession);

router.route("/payment/webhook").post(stripeWebhook);

export default router;