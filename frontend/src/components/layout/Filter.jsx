import React, { useActionState, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom';
import { getPriceQueryParams } from '../../helpers/helpers';
import { PRODUCT_CATEGORIES } from "../../constants/constants";
const Filter = () => {

    

    const [min,SetMin] = useState(0);
    const [max,SetMax] = useState(0);

    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams()
    const currentCategory = searchParams.get('category');


  const handleButtonClick = (e) => {
  e.preventDefault()

  let newSearchParams = new URLSearchParams(searchParams)

  newSearchParams = getPriceQueryParams(newSearchParams, "min", min)
  newSearchParams = getPriceQueryParams(newSearchParams, "max", max)

  setSearchParams(newSearchParams)
}

const handleCategoryClick = (category) => {
  if (category) {
    searchParams.set('category', category)
    searchParams.set('page', 1)
  } else {
    searchParams.delete('category')
  }

  navigate(`?${searchParams.toString()}`)
}



  return (
    <div className="border p-3 filter">
      <h3>Filters</h3>
      <hr />
      <h5 className="filter-heading mb-3">Price</h5>
      <form  id="filter_form" className="px-2" action="your_action_url_here"  method="get"  onSubmit={handleButtonClick}>
        <div className="row">
          <div className="col">
            <input
              type="text"
              className="form-control"
              placeholder="Min ($)" 
              value={min}
              onChange={(e) => SetMin(Number(e.target.value))}
            />
          </div>
          <div className="col">
            <input
              type="text"
              className="form-control"
              placeholder="Max ($)" 
              value={max}
              onChange={(e) => SetMax(Number(e.target.value))}
            />
          </div>
          <div className="col">
            <button type="submit" className="btn btn-primary">GO</button>
          </div>
        </div>
      </form>
      <hr />
      <h5 className="mb-3">Category</h5>

        <ul className="list-group">
          {PRODUCT_CATEGORIES?.map((category) => {
            // HIGHLIGHT: Logic to check if this item matches the URL
            const isChecked = category === currentCategory;

            return (
              <li
                key={category}
                className="list-group-item"
                style={{ cursor: 'pointer' }}
                onClick={() => handleCategoryClick(category)}
              >
                {/* HIGHLIGHT: Checkbox input added here */}
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    checked={isChecked}
                    readOnly
                  />
                  <label 
                    className="form-check-label"
                    
                    style={{ 
                            fontWeight: isChecked ? 'bold' : 'normal',
                            color: isChecked ? '#ff69b4' : 'inherit' 
                          }}
                  >
                    {category}
                  </label>
                </div>
              </li>
            );
          })}
        </ul> 

      <hr />
     
       
      </div>
  )
}

export default Filter