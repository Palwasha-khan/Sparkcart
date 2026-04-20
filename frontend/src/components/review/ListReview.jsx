import React from 'react' 

const ListReview = ({reviews}) => {
  return (
     <>
       <div className="reviews w-75">
      <h3>Other's Reviews:</h3>
      <hr />
      <div className="review-card my-3">
        <div className="row">
          <div className="col-1">
            <img
              src="../images/default_avatar.jpg"
              alt="User Name"
              width="50"
              height="50"
              className="rounded-circle"
            />
          </div>
          <div className="col-11">
            <div className="star-ratings">
              <i className="fa fa-star star-active"></i>
              <i className="fa fa-star star-active"></i>
              <i className="fa fa-star star-active"></i>
              <i className="fa fa-star star-active"></i>
              <i className="fa fa-star star-active"></i>
            </div>
            <p className="review_user">by User Name</p>
            <p className="review_comment">Review Comment Text</p>
          </div>
        </div>
        <hr />
      </div>
    </div>
    
     </>
  )
}

export default ListReview