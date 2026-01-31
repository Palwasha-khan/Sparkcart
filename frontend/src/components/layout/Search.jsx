import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';

const Search = () => {

    const [keyword, setKeyword]= useState("");

    const navigate = useNavigate

    const submitHandler = (e) =>{
        e.preventDefault();

        if(keyword?.trim()){
            navigate(`/?keyword=${keyword}`);
        }else{
            navigate(`/`);
        }
    }
  return (
     <>
     <div className="col-12 col-md-6 mt-2 mt-md-0">
        <form>
          <div className="input-group">
            <input
              type="text"
              id="search_field"
              className="form-control"
              placeholder="Enter Product Name ..."
              name="keyword"
              value={keyword}
              onChange={(e)=> setKeyword(e.target.value)}

            />
            <button id="search_btn" className="btn" type="submit">
              <i className="fa fa-search" />
            </button>
          </div>
        </form>
      </div>
     </>
  )
}

export default Search