import mongoose from "mongoose";
import Product from "./product.js";

const orderSchema = new mongoose.Schema({
    shippingInfo:{
        address:{
            type:String,
            required:true,
         },
        city:{
            type:String,
            required:true,
         },
        phoneNo:{
            type:String,
            required:true,
         },
        zipCode:{
            type:String,
            required:true,
         },
         country:{
            type:String,
            required:true,
         },
},
    user: {
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"User",
    },
    orderItems:[
        {
            name:{
              type:String,
            required:true,
            },
            quantity:{
              type:Number,
            required:true,
            },
            images:{
              type:String,
            required:true,
            },
            price:{
              type:Number,
            required:true,
            },
            product:{
              type:mongoose.Schema.Types.ObjectId,
              required:true,
              ref:"Product",
            },
        },
    ],
    paymentMethod:{
        type:String,
        required:[true,"please select Payment method"],
        enum:{
            values:["COD","Card"],
            message:"Please SElect : COD or Card"
        },
    },
    paymentInfo:{
        id:String,
        status:String,
    },
    itemsPrice:{
        type:Number,
        required:true,
    },
    taxAmount:{
        type:Number,
        required:true,
    },
    ShippingAmount:{
        type:Number,
        required:true,
    },
    totalAmount:{
        type:Number,
        required:true,
    },
    orderStatus:{
        type:String,
       
        enum:{
            values:["Processing","Shipped","Delivered"],
            message:"Please Select correct order status"
        },
         default:"Processing",
        
    },
    deliveredAt:Date
},{timestamps:true}
)

export default mongoose.model('Order',orderSchema)