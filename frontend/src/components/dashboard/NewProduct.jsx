import React from 'react' 
import { useCreateProductMutation } from '../../redux/api/productApi'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import MetaData from '../layout/Metadata'
import AdminLayout from '../layout/adminLayout'
import toast from 'react-hot-toast'
import { PRODUCT_CATEGORIES } from "../../constants/constants";

const NewProduct = () => {

    const navigate = useNavigate()
    const [product, setProduct] = useState({
        name: "",
        price: 0,
        category: "",   
        description: "",
        stock: 0,
        seller: "",
    })

    const [createProduct,{isLoading, isSuccess, error}] = useCreateProductMutation()

    useEffect(() => {
        if(isSuccess){
            toast.success("Product created successfully")
            navigate("/admin/products")
        }
        if(error){

           toast.error(error?.data?.message )
       }
    }, [isSuccess, error, navigate])
    const { name, price, category, description, stock, seller } = product;
    const submitHandler = (e) =>{
        e.preventDefault()
        console.log(product)
        createProduct(product)
    }
  return (
     <>
     <MetaData title={'New Product'}/>
    <AdminLayout> 
         <div className="row wrapper">
      <div className="col-10 col-lg-10 mt-5 mt-lg-0">
        <form className="shadow rounded bg-body" >
          <h2 className="mb-4">New Product</h2>
          <div className="mb-3">
            <label htmlFor="name_field" className="form-label"> Name </label>
            <input
              type="text"
              id="name_field"
              className="form-control"
              name="name"
              value={product.name}
              onChange={(e) => setProduct({ ...product, name: e.target.value })}
            />
          </div>

          <div className="mb-3">
            <label htmlFor="description_field" className="form-label">
              Description
            </label>
            <textarea
              className="form-control"
              id="description_field"
              rows="8"
              name="description"
              value={product.description}
              onChange={(e) => setProduct({ ...product, description: e.target.value })}     

            ></textarea>
          </div>

          <div className="row">
            <div className="mb-3 col">
              <label htmlFor="price_field" className="form-label"> Price </label>
              <input
                type="text"
                id="price_field"
                className="form-control"
                name="price"
                value={product.price}
                onChange={(e) => setProduct({ ...product, price: e.target.value })} 
              />
            </div>

            <div className="mb-3 col">
              <label htmlFor="stock_field" className="form-label"> Stock </label>
              <input
                type="number"
                id="stock_field"
                className="form-control"
                name="stock"
                value={product.stock}
                onChange={(e) => setProduct({ ...product, stock: e.target.value })}
              />
            </div>
          </div>
          <div className="row">
           <div className="mb-3 col">
            <label htmlFor="category_field" className="form-label"> Category </label>
            <select 
                className="form-select" 
                id="category_field" 
                name="category" 
                value={product.category} 
                onChange={(e) => setProduct({ ...product, category: e.target.value })}
            >
                {/* Default empty option */}
                <option value="">Select Category</option>
                 
                {PRODUCT_CATEGORIES?.map((category) => (
                <option key={category} value={category}>
                    {category}
                </option>
                ))}
            </select>
            </div>
            <div className="mb-3 col">
              <label htmlFor="seller_field" className="form-label"> Seller Name </label>
              <input
                type="text"
                id="seller_field"
                className="form-control"
                name="seller"
                value={product.seller}
                onChange={(e) => setProduct({ ...product, seller: e.target.value })}
              />
            </div>
          </div>
          <button type="submit" className="btn w-100 py-2" onClick={submitHandler} disabled={isLoading}>
            {isLoading?  "Creating..." : "CREATE"}
          </button>
        </form>
      </div>
    </div>

    </AdminLayout>
     </>
  )
}

export default NewProduct