import React, { useEffect, useState } from 'react';
import { 
  useUpdateProductMutation, 
  useGetProductDetailsQuery  
} from '../../redux/api/productApi';
import { useNavigate, useParams } from 'react-router-dom'; 
import MetaData from '../layout/Metadata';
import AdminLayout from '../layout/adminLayout';
import toast from 'react-hot-toast';
import { PRODUCT_CATEGORIES } from "../../constants/constants";

const UpdateProduct = () => {
    const navigate = useNavigate();
    const params = useParams();  

    const [product, setProduct] = useState({
        name: "",
        price: 0,
        category: "",   
        description: "",
        stock: 0,
        seller: "",
    });

    
    const { data: existingProduct, error: fetchError } = useGetProductDetailsQuery(params?.id);

    const [updateProduct, { isLoading, isSuccess, error }] = useUpdateProductMutation();

    useEffect(() => {
        
        if (existingProduct?.product) {
            setProduct({
                name: existingProduct?.product?.name,
                price: existingProduct?.product?.price,
                category: existingProduct?.product?.category,
                description: existingProduct?.product?.description,
                stock: existingProduct?.product?.stock,
                seller: existingProduct?.product?.seller,
            });
        }

        if (fetchError) {
            toast.error(fetchError?.data?.message);
        }

        if (isSuccess) {
            toast.success("Product updated successfully");
            navigate("/admin/products");
        }
        
        if (error) {
            toast.error(error?.data?.message);
        }
    }, [isSuccess, error, existingProduct, fetchError, navigate]);

    const submitHandler = (e) => {
        e.preventDefault();
        
        // --- HIGHLIGHT: Send ID and Body to the mutation ---
        updateProduct({ id: params?.id, body: product });
    };

  return (
     <>
     <MetaData title={'Update Product'}/>
    <AdminLayout> 
         <div className="row wrapper">
      <div className="col-10 col-lg-10 mt-5 mt-lg-0">
        <form className="shadow rounded bg-body" onSubmit={submitHandler}>
          <h2 className="mb-4">Update Product</h2> {/* --- Changed Label --- */}
          
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
          
          {/* --- HIGHLIGHT: Changed Button Text --- */}
          <button type="submit" className="btn w-100 py-2" disabled={isLoading}>
            {isLoading ? "Updating..." : "UPDATE"}
          </button>
        </form>
      </div>
    </div>

    </AdminLayout>
     </>
  )
}

export default UpdateProduct;