import React from 'react'
import { Link } from 'react-router-dom'
import StarRatings from "react-star-ratings";

const ProductItem = ({product}) => {
  return (
    <>
     <div className="col-sm-12 col-md-6 col-lg-3 my-3">
  <div className="card p-2 rounded"> {/* Reduced padding slightly to match pic */}
    <img
      className="card-img-top mx-auto"
      src={product?.images[0]?.url}
      alt={product?.name}
    />

    <div className="card-body ps-3 d-flex justify-content-center flex-column">
      <h5 className="card-title">
        <Link to={`/product/${product?._id}`}>{product?.name}</Link>
      </h5>

      <div className="ratings mt-auto d-flex align-items-center">
        <StarRatings
          rating={product?.ratings}
          starRatedColor="#ffb829" 
          numberOfStars={5}
          name='rating'
          starDimension="18px" // Made stars a bit smaller/elegant
          starSpacing="1px"
        />
        <span id="no_of_reviews" className="pt-1 ps-2">
          {product?.numOfReviews}
        </span>
      </div>

      <p className="card-text mt-2">${product?.price}</p>

      {/* Changed <a> to <Link> for smoother navigation */}
      <Link to={`/product/${product?._id}`} id="view_btn" className="btn btn-block">
        View Details
      </Link>
    </div>
  </div>
</div>
    </>
  )
}

export default ProductItem