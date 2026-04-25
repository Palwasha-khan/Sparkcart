import React, { useEffect, useState } from 'react'
import { useParams} from 'react-router-dom'
import {useGetProductDetailsQuery} from '../../redux/api/productApi'
import Loader from '../layout/Loader'
import StarRatings from "react-star-ratings";
import { useDispatch, useSelector } from 'react-redux';
import { setCartItem } from '../../redux/features/cartSlice';
import toast from 'react-hot-toast';
import MetaData from '../layout/Metadata';
import NewReview from '../review/NewReview';
import ListReview from '../review/ListReview';

const ProductDetails = () => {
  const params = useParams();
  const [quantity, setQuantity] = useState(1);
  const dispatch = useDispatch()

  const { data, isLoading, isError, error } =
    useGetProductDetailsQuery(params?.id);

  const product = data?.product;
  const {isAuthenticated} = useSelector((state) => state.auth)

  const [activeImg, setActiveImg] = useState("");

  useEffect(() => {
    if (isError) {
      toast.error(error?.data?.message || "Something went wrong");
    }
  }, [isError, error]);

  
  useEffect(() => {
    if (!product) return;

    setActiveImg(
      product?.images?.[0]?.url
        ? product.images[0].url
        : "/images/default_product.png"
    );
  }, [product]);

  const increseQty = () => {
  if (quantity >= product.stock) return;
  setQuantity(prev => prev + 1);
};

  const decreseQty = () => {
  if (quantity <= 1) return;
  setQuantity(prev => prev - 1);
};

  const setItemCart = () =>{
    if (quantity <= 0) return;
    const cartItem = {
      product : product?._id,
      name : product?.name,
      price : product?.price,
      images :  product?.images?.[0]?.url,
      stock : product?.stock,
      quantity 
    }
    dispatch(setCartItem(cartItem))
    console.log("CART ITEM:", cartItem);

    toast.success("Item added to cart")
  }

  if (isLoading) return <Loader />;

  return (
    <>
    <MetaData title={product?.name}/>
    <div className="row d-flex justify-content-around">
      <div className="col-12 col-lg-5 img-fluid" id="product_image">
        <div className="p-3">
          <img
            className="d-block w-100"
            src={activeImg}
            alt=""
            width="340"
            height="390"
          />
        </div >
        <div className="row justify-content-start mt-5">
          {product?.images?.map((img, index) => (
            <div key={index} className="col-2 ms-4 mt-2">
                <a role="button" onClick={() => setActiveImg(img.url)}>
                <img
                    className={ `d-block border rounded p-3 cursor-pointer ${img.url === activeImg ? "border-warning" : ""}`}
                    height="100"
                    width="100"
                    src={img.url || "/images/default_product.png"}
                    alt={`Thumbnail ${index + 1}`}
                />
                </a>
            </div>
            ))}

        </div>
      </div>

      <div className="col-12 col-lg-5 mt-5">
        <h3>{product?.name}</h3>
        <p id="product_id">Product # {product?._id}</p>

        <hr />

        <div className="d-flex">
         <StarRatings
                        rating={product?.ratings}
                        starRatedColor="#ffb829" 
                        numberOfStars={5}
                        name='rating'
                        starDimension="22px"
                        starSpacing="1px"
                        />
          <span id="no-of-reviews" className="pt-1 ps-2"> ({product?.numOfReviews} Reviews) </span>
        </div>
        <hr />

        <p id="product_price">${product?.price}</p>
        <div className="stockCounter d-inline">
          <span className="btn btn-danger minus" onClick={decreseQty}>-</span>
          <input
            type="number"
            className="form-control count d-inline"
            value={quantity}
            readOnly
          />
          <span className="btn btn-primary plus" onClick={increseQty}>+</span>
        </div>
        <button
          type="button"
          id="cart_btn"
          className="btn btn-primary d-inline ms-4"
          disabled= {product?.stock <= 0}
          onClick={setItemCart}
        >
          Add to Cart
        </button>

        <hr />

        <p>
          Status: <span id="stock_status" className={product?.stock >0 ? "greenColor" : "redColor"}>
            {product?.stock >0 ? "In stock" : "out of stock"}
          </span>
        </p>

        <hr />

        <h4 className="mt-2">Description:</h4>
        <p>
         {product?.description}
        </p>
        <hr />
        <p id="product_seller mb-3">Sold by: <strong>{product?.seller}</strong></p>

        {isAuthenticated ? <NewReview productId={product?._id} />:
        <div className="alert alert-danger my-5" type="alert">
          Login to post your review.
        </div>}
      </div>
    </div>
    {product?.reviews?.length > 0 && (
        <ListReview reviews={product?.reviews}/>)}
    </>
  )
}

export default ProductDetails