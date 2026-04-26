import React from 'react'
import AdminLayout from '../layout/adminLayout'

const ProcessOrder = () => {
  return (
    <>
    <MetaData title={'Process Order'}/>
    <AdminLayout>
           <div className="row d-flex justify-content-around">
      <div className="col-12 col-lg-8 order-details">
        <h3 className="mt-5 mb-4">Order Details</h3>

        <table className="table table-striped table-bordered">
          <tbody>
            <tr>
              <th scope="row">ID</th>
              <td>345345345345</td>
            </tr>
            <tr>
              <th scope="row">Status</th>
              <td className="greenColor">
                <b>Not Paid</b>
              </td>
            </tr>
          </tbody>
        </table>

        <h3 className="mt-5 mb-4">Shipping Info</h3>
        <table className="table table-striped table-bordered">
          <tbody>
            <tr>
              <th scope="row">Name</th>
              <td>John</td>
            </tr>
            <tr>
              <th scope="row">Phone No</th>
              <td>123-345-2322</td>
            </tr>
            <tr>
              <th scope="row">Address</th>
              <td>Lorem</td>
            </tr>
          </tbody>
        </table>

        <h3 className="mt-5 mb-4">Payment Info</h3>
        <table className="table table-striped table-bordered">
          <tbody>
            <tr>
              <th scope="row">Status</th>
              <td className="greenColor">
                <b>Not Paid</b>
              </td>
            </tr>
            <tr>
              <th scope="row">Method</th>
              <td>COD</td>
            </tr>
            <tr>
              <th scope="row">Stripe ID</th>
              <td>Nill</td>
            </tr>
            <tr>
              <th scope="row">Amount</th>
              <td>$12</td>
            </tr>
          </tbody>
        </table>

        <h3 className="mt-5 my-4">Order Items:</h3>

        <hr />
        <div className="cart-item my-1">
          <div className="row my-5">
            <div className="col-4 col-lg-2">
              <img
                src="../images//default_product.png"
                alt=""
                height="45"
                width="65"
              />
            </div>
            <div className="col-5 col-lg-5">
              <a href="">Product</a>
            </div>
            <div className="col-4 col-lg-2 mt-4 mt-lg-0">
              <p>$34</p>
            </div>
            <div className="col-4 col-lg-3 mt-4 mt-lg-0">
              <p>2 Piece(s)</p>
            </div>
          </div>
        </div>
        <hr />
      </div>

      <div className="col-12 col-lg-3 mt-5">
        <h4 className="my-4">Status</h4>

        <div className="mb-3">
          <select className="form-select" name="status" value="">
            <option value="Processing">Processing</option>
            <option value="Shipped">Shipped</option>
            <option value="Delivered">Delivered</option>
          </select>
        </div>

        <button className="btn btn-primary w-100">Update Status</button>

        <h4 className="mt-5 mb-3">Order Invoice</h4>
        <a href="#" className="btn btn-success w-100">
          <i className="fa fa-print"></i> Generate Invoice
        </a>
      </div>
    </div>
    </AdminLayout>
    </>  )
}

export default ProcessOrder;