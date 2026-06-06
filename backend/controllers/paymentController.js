import { resolve } from "dns";
import catchAsyncErrors from "../middleware/catchAsyncErrors.js"
import Stripe from "stripe";
import Order from "../models/order.js";
import { getOrderEmailTemplate } from '../utils/emailTemplate.js';
import sendEmail from '../utils/sendEmail.js';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);       

//  Create Stripe checkout session => /api/v1/payment/checkout_session
export const stripeCheckoutSession = catchAsyncErrors(
 async (req, res,next) => {
    console.log("SUCCESS URL:", `${process.env.FRONTEND_URL}/me/orders`);
    console.log("CANCEL URL:", `${process.env.FRONTEND_URL}`);
    const body = req.body;

    const line_items = body?.orderItems?.map((item) => {
        return {
            price_data: {
                currency: 'pkr', 
                unit_amount: Math.round(item.price * 100), 
                product_data: {
                    name: item?.name,
                    images: item?.image ? [item.image] : [], 
                    metadata: {productId: item?.product}
                },
            },
            tax_rates: ['txr_1TeDKLPHzoi6SqoAjTdmdFkX'],
            quantity: item?.quantity
        };
    });

    const shippingInfo = body?.shippingInfo;

    const shipping_Rate = body?.itemsPrice >= 2000 ? "shr_1TeDIOPHzoi6SqoA5X1ZEJPn" : "shr_1TeDHUPHzoi6SqoABRC1vonG";

    const session = await stripe.checkout.sessions.create({
        
        payment_method_types: ["card"],
        success_url: `${process.env.FRONTEND_URL}/me/orders?order_success=true`,
        cancel_url: `${process.env.FRONTEND_URL}`,
        customer_email: req?.user?.email,     
        client_reference_id: req?.user?._id.toString(),
        shipping_address_collection: {
            allowed_countries: ['US', 'PK'],
        },
        mode: 'payment',
        metadata: {...shippingInfo, itemsPrice: body?.itemsPrice},
        shipping_options: [
        {
            shipping_rate: shipping_Rate
        }
        ],
        line_items,
    })
   
    res.status(200).json({
        success: true,
        url: session.url,
    })
 })

const getOrdersItems = async (line_items) => {
    const cartItems = [];

    for (const item of line_items.data) {
        const product = await stripe.products.retrieve(item.price.product);
        const productId = product.metadata.productId;

        cartItems.push({
            product: productId,
            name: product.name, // ❗ fix
            price: item.price.unit_amount / 100,
            quantity: item.quantity,
            images: item.image || item.images || "https://via.placeholder.com/150", // ✅ REQUIRED
             
        });
    }

    return cartItems;
};

 //  Create Stripe checkout session => /api/v1/payment/checkout_session
export const stripeWebhook = catchAsyncErrors(async (req, res,next) => {
    try {
        const sig = req.headers['stripe-signature'];
        const event = stripe.webhooks.constructEvent(
            req.rawBody,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET
        );

        if (event.type === 'checkout.session.completed') {
            const session = event.data.object;
            
            const line_items = await stripe.checkout.sessions.listLineItems(
                session.id)
            const orderItems = await getOrdersItems(line_items);
            const user = session.client_reference_id;
            const totatlAmount = session.amount_total/100;
          const shippingInfo = {
            address: session.shipping?.address?.line1 || session.metadata.address,
            city: session.shipping?.address?.city || session.metadata.city,
            zipCode: session.shipping?.address?.postal_code || session.metadata.zipCode,
            country: session.shipping?.address?.country || session.metadata.country,
            phoneNo: session.customer_details?.phone || session.metadata.phoneNo,
        };
            const ShippingAmount = session.total_details.amount_shipping/100;
            const itemsPrice = session.metadata.itemsPrice;
            const TaxAmount = session.total_details.amount_tax/100;

            const paymentInfo = {
                id: session.payment_intent,
                status: session.payment_status,
            }   
            const orderData = {
                orderItems,
                user,
                totalAmount: totatlAmount,
                shippingInfo,
                ShippingAmount: ShippingAmount,
                itemsPrice: itemsPrice,
                taxAmount: TaxAmount,
                paymentInfo,
                paymentMethod: "Card",
            };
            console.log(orderData)
           const order =  await Order.create(orderData);
            try {
                    const customerHtml = getOrderEmailTemplate(order, false);
                    await sendEmail({
                        email: session.customer_details?.email || req?.user?.email, // Customer email
                        subject: '✨ SparkCart - Order Confirmation',
                        html: customerHtml
                    });

                    const adminHtml = getOrderEmailTemplate(order, true);
                    await sendEmail({
                        email: process.env.ADMIN_EMAIL, // Aapka official email
                        subject: '🚨 New Order Alert - SparkCart',
                        html: adminHtml
                    });

                    console.log("Both order emails sent successfully!");
                } catch (emailError) {
                    console.log("Email sending failed but order was saved:", emailError);
                }

        res.status(200).json({ received: true });
        }
    } catch (error) {
    console.log("WEBHOOK ERROR:", error.message);
    return res.status(400).send(`Webhook Error: ${error.message}`);
}
}
)
// stripe listen --events checkout.session.completed --forward-to localhost:3000/api/v1/payment/webhook