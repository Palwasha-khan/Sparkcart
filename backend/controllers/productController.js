import Product from "../models/product.js";
import catchAsyncErrors from "../middleware/catchAsyncErrors.js";
import ErrorHandler from "../utils/errorHandler.js";
import APIFilters from "../utils/apiFilter.js";
import mongoose from "mongoose";
import Order from "../models/order.js";
import { delete_file, upload_file } from "../utils/cloudinary.js";

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

  const product = await Product.findById(req.query.id).populate("reviews.user");

  if (!product) {
    return next(new ErrorHandler("product not found", 404));
  }
 
  res.status(200).json({
    reviews:product.reviews,
  });
});

//delete reviews
export const deleteReview = catchAsyncErrors(async (req, res, next) => {
  const { productId, id } = req.query;

  let product = await Product.findById(productId);

  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  // 1. Filter the reviews
  const filteredReviews = product.reviews.filter(
    (review) => review._id.toString() !== id.toString()
  );

  // 2. Update the product object fields directly
  product.reviews = filteredReviews;
  product.numOfReviews = filteredReviews.length;

  // 3. Recalculate ratings
  product.ratings =
    product.numOfReviews === 0
      ? 0
      : filteredReviews.reduce((acc, item) => acc + item.rating, 0) /
        product.numOfReviews;

  // 4. 🔥 Use .save() instead of findByIdAndUpdate
  await product.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
    product // Send this back so you can see the change in Postman
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


//Admin Functions//


//Get  products => /api/v1/admin/products
export const getAdminProducts = catchAsyncErrors(async (req,res,next) => {

   
  let products = await Product.find();

  res.status(200).json({
    success: true,
    products,
  });
})



//create new products => /api/v1/admin/products
export const newProducts = catchAsyncErrors(async (req,res) => {

  try {
 req.body.user = req.user._id; 

   
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

//delete products => /api/v1/products/:id
export const deleteProduct = catchAsyncErrors(async (req,res) => {

  try {
  let product = await Product.findById(req?.params?.id);

  if(!product){
   return res.status(400).json({
    success: false,
    message: "Product not found"
  });
  }

 await product.deleteOne();
  res.status(200).json({
    success: true,
    message: "Product deleted successfully"
  });
} catch (error) {
  res.status(400).json({
    success: false,
    message: error.message
  });
}
})


//update products => /api/v1/admin/products/:id
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


//upload product images => /api/v1/admin/products/:id/upload_images
export const uploadProductImages = catchAsyncErrors(async (req, res, next) => {
 console.log("Starting Upload Process...");
 
  let product = await Product.findById(req?.params?.id);

  if (!product) return next(new ErrorHandler("Product not found", 404));

  const uploader = async (image) => upload_file(image, "shopit/products");
try {
    const urls = await Promise.all(req.body.images.map(uploader));
    console.log("Uploads finished successfully!");

    product?.images?.push(...urls);
    await product.save({ validateBeforeSave: false });

    res.status(200).json({ success: true, product });
  } catch (error) { 
    return next(new ErrorHandler("Upload to Cloudinary failed", 500));
  }
});

// Using the $pull operator is better than .filter() + .save() 
// because it's a single database operation.
export const deleteProductImage = catchAsyncErrors(async (req, res, next) => {
  let product = await Product.findById(req?.params?.id);

  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  const { imgId } = req.body; 

  // 1. Delete from Cloudinary
  await delete_file(imgId);

  // 2. Delete from MongoDB using $pull (This is the most reliable way)
  product = await Product.findByIdAndUpdate(
    req?.params?.id,
    {
      $pull: {
        images: {
          public_id: imgId,
        },
      },
    },
    { new: true } // Returns the updated document
  );
 

  res.status(200).json({
    success: true,
    product,
  });
});