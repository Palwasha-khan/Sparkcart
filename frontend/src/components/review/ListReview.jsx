import React from 'react' 
import StarRatings from 'react-star-ratings'

const ListReview = ({reviews}) => {
  return (
     <>
       <div className="reviews w-75">
      <h3>Other's Reviews:</h3>
      <hr />
      
      {reviews?.map((review) => (
        <div className="review-card my-3" key={review._id}>
          <div className="row"> 
          <div className="col-1">
            <img
              src={review?.user?.avatar ? review.user?.avatar?.url : "../images/default_avatar.jpg"}
              alt="User Name"
              width="50"
              height="50"
              className="rounded-circle"
            />
          </div>
          <div className="col-9">
            <StarRatings
                        rating={review?.rating}
                        starRatedColor="#ffb829" 
                        numberOfStars={5}
                        name='rating' 
                        changeRating={(e) => setRating(e)}
                        />
            <p className="review_user">by {review?.user?.name  || "Anonymous"}</p>
            <p className="review_comment">{review?.comment}</p>
          </div>
        </div>
        <hr />
      </div>))}
    </div>
    
     </>
  )
}

export default ListReview