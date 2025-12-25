import catchAsyncErrors from "../middleware/catchAsyncErrors.js"
import Order from "../models/order.js" 
import Product from "../models/product.js";
import ErrorHandler from "../utils/errorHandler.js";

//create new order => api/v1/orders/new
export const newOrder = catchAsyncErrors(async(req,res,next)=>{
    const{
        orderItems,
        shippingInfo,
        itemsPrice,
        paymentMethod,
        paymentInfo,
        taxAmount,
        totalAmount,
        ShippingAmount,
    } = req.body;

    const order = await Order.create({
        orderItems,
        shippingInfo,
        itemsPrice,
        paymentMethod,
        paymentInfo,
        taxAmount,
        totalAmount,
        ShippingAmount,
        user:req.user._id,
    });

    res.status(200).json({
       order,
    })
})

//get user orders => api/v1/me/orders
export const myOrders = catchAsyncErrors(async(req,res,next)=>{
    const orders = await Order.find({user:req.user._id})

    res.status(200).json({
       orders,
    })
})

//get order details => api/v1/orders/:id
export const getOrderDetails = catchAsyncErrors(async(req,res,next)=>{
    const order = await Order.findById(req.params.id).populate("user","name email")

    if(!order){
        return next(new ErrorHandler('order not found with this id',404))
    }

    res.status(200).json({
       order,
    })
})

//get all orders - Admin => api/v1/admin/orders
export const allOrders = catchAsyncErrors(async(req,res,next)=>{
    const orders = await Order.find()

    res.status(200).json({
       orders,
    })
})

//update orders - Admin => api/v1/admin/orders/:id
export const updateOrders = catchAsyncErrors(async(req,res,next)=>{
    const order = await Order.findById(req.params.id)
 
    if(!order){
        return next(new ErrorHandler('order not found with this id',404))
    }

    if(order?.orderStatus === "Delivered"){
        return next(new ErrorHandler('you have already delivered this order',401))
    }

    //update stock
    order?.orderItems?.forEach(async (item) => {
  const product = await Product.findById(item?.product?.toString());
  if (!product) {
    return next(new ErrorHandler('Product not found with this id', 404));
  }
  product.stock -= item.quantity;
  await product.save({ validateBeforeSave: false });
});


    order.orderStatus = req.body.status;
    order.deliveredAt = Date.now();

    await order.save();
    res.status(200).json({
       success:true,
    })
})


//delete order   => api/v1/orders/:id
export const deleteOrder = catchAsyncErrors(async(req,res,next)=>{
    const order = await Order.findById(req.params.id) 
    if(!order){
        return next(new ErrorHandler('order not found with this id',404))
    }
    
    await Order.deleteOne();
    res.status(200).json({
      success:true
    })
})