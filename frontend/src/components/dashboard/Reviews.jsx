import React from 'react'
import AdminLayout from '../layout/adminLayout'

const Reviews = () => {
  return (
     <>
     <MetaData title={'Product Reviews'}/>
    <AdminLayout>
     <div className="row justify-content-center my-5">
      <div className="col-6">
        <form>
          <div className="mb-3">
            <label for="productId_field" className="form-label">
              Enter Product ID
            </label>
            <input
              type="text"
              id="productId_field"
              className="form-control"
              value=""
            />
          </div>

          <button
            id="search_button"
            type="submit"
            className="btn btn-primary w-100 py-2"
          >
            SEARCH
          </button>
        </form>
      </div>
    </div>

    <h5 className="mt-3 text-center">Product name: <b></b></h5>
    <table className="table table-bordered table-striped mt-5">
      <thead>
        <tr>
          <th>User</th>
          <th>Rating</th>
          <th>Comment</th>
        </tr>
      </thead>
      <tbody></tbody>
    </table>
    </AdminLayout>
     </>
  )
}

export default Reviews