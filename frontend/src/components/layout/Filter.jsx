import React, { useActionState, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom';
import { getPriceQueryParams } from '../../helpers/helpers';

const Filter = () => {

    const categories = ["bracelets",
                "rings",
                "anklets",
                "necklace",
                "hair Accessories",
                "earrings",
                "studs",
            ]

    const [min,SetMin] = useState(0);
    const [max,SetMax] = useState(0);

    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams()


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
        {categories.map((category) => (
            <li
            key={category}
            className="list-group-item"
            style={{ cursor: 'pointer' }}
            onClick={() => handleCategoryClick(category)}
            >
            {category}
            </li>
        ))}
        </ul>

      <hr />
     
       
      </div>
  )
}

export default Filter