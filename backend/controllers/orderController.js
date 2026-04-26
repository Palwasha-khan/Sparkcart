import { get } from "mongoose";
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


//Admin Functions

async function getSalesData(startDate, endDate) {
  const salesData = await Order.aggregate([
    {
      $match: {
        createdAt: { $gte:new Date(startDate), $lte: new Date(endDate) }
      }
    },
    {
      $group: {
        _id: { 
            date: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }
        },
        totalSales: { $sum: "$totalAmount" },
        totalOrders: { $sum: 1 }
      }
    }
  ]);
  
  //create a map to staore sales data by date and num of order by data
    const salesMap = new Map();
    let totalSales = 0;
    let totalNumOrders = 0; 

    salesData.forEach((item) => {
        const date = item?._id?.date;
        const sales = item?.totalSales || 0;
        const orders = item?.totalOrders || 0;

        salesMap.set(date, {  sales, orders})
        totalSales += sales;
        totalNumOrders += orders;
    });

    //generate array of dates between start and end date
    const datesbetween = getDatesBetween(startDate, endDate);
     
    //create funal sales data array with 0 array for dates with no sales
    const finalSalesData = datesbetween.map((date) => {
        // Get the data object for this specific date
        const dayData = salesMap.get(date); 

        return {
            date,
            // Use Nullish Coalescing (??). 
            // If dayData exists, take the value; otherwise, default to 0.
            sales: dayData?.sales ?? 0,   // HIGHLIGHT: Fixed from undefined
            orders: dayData?.orders ?? 0, // HIGHLIGHT: Fixed from undefined
        };
    }); 
    return { salesData: finalSalesData, totalSales, totalNumOrders };
}

function getDatesBetween(startDate, endDate) {
    const dates = [];
    const currentDate = new Date(startDate);

    while (currentDate <= new Date(endDate)) {
        // Using UTC methods ensures April 24 stays April 24 regardless of local time
        const yyyy = currentDate.getUTCFullYear();
        const mm = String(currentDate.getUTCMonth() + 1).padStart(2, '0');
        const dd = String(currentDate.getUTCDate()).padStart(2, '0');
        
        const formattedDate = `${yyyy}-${mm}-${dd}`;
        dates.push(formattedDate);
        
        // Move to the next day using UTC
        currentDate.setUTCDate(currentDate.getUTCDate() + 1);
    }

    return dates;
}

//get sales Data   => api/v1/admin/get_sales
export const getSales = catchAsyncErrors(async(req,res,next)=>{
     const startDate = new Date(req.query.startDate);
     const endDate = new Date(req.query.endDate);

     startDate.setUTCHours(0, 0, 0, 0);
     endDate.setUTCHours(23, 59, 59, 999); 

    const { salesData, totalSales, totalNumOrders } = await getSalesData(startDate, endDate);
    res.status(200).json({
      sales:salesData,
      totalSales,
      totalNumOrders,
    })
})