import Product from "../models/product.js";
import catchAsyncErrors from "../middleware/catchAsyncErrors.js";
import ErrorHandler from "../utils/errorHandler.js";
import APIFilters from "../utils/apiFilter.js";


// products => /api/v1/products
export const getProducts = catchAsyncErrors(async (req,res) => {
    
    try {
        const resPerPage = 4;
        const apiFilters = new APIFilters(Product,req.query).search().filters();

        let products = await apiFilters.query;
        let filterProductscount = products.length
        // const products = await Product.find();

        apiFilters.pagination(resPerPage);
        products = await apiFilters.query.clone();

         res.status(200).json({
            resPerPage,
            filterProductscount,
            products,
    })
    } catch (error) {
        res.status(400).json({
    success: false,
    message: error.message
  });
    }

    res.status(200).json({
        message: "All products",
    })
})

//create new products => /api/v1/admin/products
export const newProducts = catchAsyncErrors(async (req,res) => {

  try {
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
  const product = await Product.findById(req?.params?.id);

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