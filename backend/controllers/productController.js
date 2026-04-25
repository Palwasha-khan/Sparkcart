import Product from "../models/product.js";
import catchAsyncErrors from "../middleware/catchAsyncErrors.js";
import ErrorHandler from "../utils/errorHandler.js";
import APIFilters from "../utils/apiFilter.js";
import mongoose from "mongoose";
import Order from "../models/order.js";

// products => /api/v1/products
export const getProducts = catchAsyncErrors(async (req, res,next) => {
 
    const resPerPage = 4;

    const apiFilters = new APIFilters(Product, req.query)
        .search()
        .filters();

    let products = await apiFilters.query;
    let filterProductscount = products.length;
 
 
    apiFilters.pagination(resPerPage);
    products = await apiFilters.query.clone();


    res.status(200).json({
        success: true,
        resPerPage,
        filterProductscount,
        products,
    });
});


//create new products => /api/v1/admin/products
export const newProducts = catchAsyncErrors(async (req,res) => {

  try {
  req.body.user = req.body._id; 
   
  const product = await Product.create(req.body);
  res.status(201).json({
    success: true,
    product
  });
} catch (error) {
  res.status(400).json({
    success: false,
    message: error.message
  });
}
})

//create single products => /api/v1/products/:id
export const getProductDeatils = catchAsyncErrors(async (req,res,next) => {

  try {
  const product = await Product.findById(req.params.id)
  .populate("reviews.user", "name");

  if(!product){
    return next(new ErrorHandler("product not found",404));
  }
  res.status(201).json({
    success: true,
    product
  });
} catch (error) {
  res.status(400).json({
    message: error.message
  });
}
})

//update products => /api/v1/products/:id
export const updateProductDeatils =catchAsyncErrors( async (req,res) => {

  try {
  let product = await Product.findById(req?.params?.id);

  if(!product){
    res.status(400).json({
    message: "Product not found"
  });
  }

 product = await Product.findByIdAndUpdate(req?.params?.id, req.body,{new:true,})
  res.status(201).json({
    success: true,
    product
  });
} catch (error) {
  res.status(400).json({
    success: false,
    message: error.message
  });
}
})

//delete products => /api/v1/products/:id
export const deleteProduct = catchAsyncErrors(async (req,res) => {

  try {
  let product = await Product.findById(req?.params?.id);

  if(!product){
    res.status(400).json({
    message: "Product not found"
  });
  }

 await Product.deleteOne();
  res.status(201).json({
    message:"product deleted"
  });
} catch (error) {
  res.status(400).json({
    success: false,
    message: error.message
  });
}
})

//create products reviews => /api/v1/reviews
export const createProductReview = catchAsyncErrors(async (req, res, next) => {
  const { rating, comment, productId } = req.body;

  const review = {
    user: req.user._id,
    rating: Number(rating),
    comment,
  };

  const product = await Product.findById(productId);

  if (!product) {
    return next(new ErrorHandler("product not found", 404));
  }

  const isReviewed = product.reviews.find(
    (r) => r.user.toString() === req.user._id.toString()
  );

  if (isReviewed) {
  product.reviews.forEach((rev) => {
    if (rev.user.toString() === req.user._id.toString()) {
      rev.comment = comment;
      rev.rating = Number(rating);
    }
  });
} else {
  product.reviews.push(review);
}

// ✅ ALWAYS update
product.numOfReviews = product.reviews.length;

product.rating =
  product.reviews.reduce((acc, item) => acc + item.rating, 0) /
  product.reviews.length;

await product.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
  });
});

//get products reviews => /api/v1/reviews
export const getProductReview = catchAsyncErrors(async (req, res, next) => {

  const product = await Product.findById(req.query.id);

  if (!product) {
    return next(new ErrorHandler("product not found", 404));
  }
 
  res.status(200).json({
    reviews:product.reviews,
  });
});
export const deleteReview = catchAsyncErrors(async (req, res, next) => {
  const { productId, id } = req.query;

  if (!mongoose.Types.ObjectId.isValid(productId)) {
    return next(new ErrorHandler("Invalid product ID", 400));
  }

  let product = await Product.findById(productId);

  if (!product) {
    return next(new ErrorHandler("product not found", 404));
  }

  const reviews = product.reviews.filter(
    (review) => review._id.toString() !== id.toString()
  );

  const numberOfReviews = reviews.length;

  const ratings =
    numberOfReviews === 0
      ? 0
      : reviews.reduce((acc, item) => acc + item.rating, 0) /
        numberOfReviews;

  await Product.findByIdAndUpdate(
    productId,
    {
      reviews,
      numberOfReviews,
      ratings,
    },
    { new: true }
  );

  res.status(200).json({
    success: true,
  });
});


// Get can user review => /api/v1/can_review
export const canUserReview = catchAsyncErrors(async (req, res, next) => {
  try {
    const { productId } = req.query;

    // 1. Validation Check
    if (!productId) {
        return res.status(400).json({ message: "Product ID is required" });
    }

   
    // 2. Convert to ObjectId safely
    const productObjectId = new mongoose.Types.ObjectId(productId);

    // 3. Find Orders
    const orders = await Order.find({
      user: req.user._id,
      "orderItems.product": productObjectId,
    });

    
    // 4. Return Response
    res.status(200).json({
      canReview: orders.length > 0,
    });

  } catch (error) {
    console.error("Internal Function Error:", error.message);
    // Pass the error to your global error handler
    next(error); 
  }
});
