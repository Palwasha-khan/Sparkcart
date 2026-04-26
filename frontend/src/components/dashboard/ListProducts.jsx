 import React, { useEffect } from 'react'
import toast from 'react-hot-toast' 
import Loader from '../layout/Loader'
import {MDBDataTable} from 'mdbreact' 
import MetaData from '../layout/Metadata'
import { useDispatch } from 'react-redux' 
import { useDeleteProductMutation, useGetAdminProductsQuery, useUpdateProductMutation } from '../../redux/api/productApi'
import { Link, useNavigate } from 'react-router-dom'
import AdminLayout from '../layout/adminLayout'
const ListProducts = () => {
  
 const navigate = useNavigate();

 const { data, isLoading: productsLoading, error: productsError } = useGetAdminProductsQuery();

 const [deleteProduct, { 
  isLoading: isDeleteLoading, 
  error: deleteError, 
  isSuccess: isDeleteSuccess 
}] = useDeleteProductMutation();

const [updateProduct, { 
  isLoading: isUpdateLoading, 
  error: updateError, 
  isSuccess: isUpdateSuccess 
}] = useUpdateProductMutation();
 
 
useEffect(() => { 

  if (productsError) {
    toast.error(productsError?.data?.message || 'Failed to fetch products');
  }
 
  if (deleteError) {
    toast.error(deleteError?.data?.message || 'Delete failed');
  }
  
 
  if (updateError) {
    toast.error(updateError?.data?.message || 'Update failed');
  }
  if (isUpdateSuccess) {
    toast.success("Product updated successfully");
    navigate("/admin/products")
  }

}, [productsError, deleteError, isDeleteSuccess, updateError, isUpdateSuccess]);

 const deleteHandler = async (id) => {
  if (window.confirm("Are you sure?")) {
    try {
      // .unwrap() allows you to use standard try/catch logic
      await deleteProduct(id).unwrap();
      toast.success("Product Deleted!");
    } catch (err) {
      toast.error(err?.data?.message || "Delete failed");
    }
  }
};

      const setProducts = () =>{
        const products = {
            columns: [
            { label: "ID", field: "id", sort: "asc" },
            { label: "Name", field: "name", sort: "asc" },
            { label: "Price", field: "price", sort: "asc" },
            { label: "Stock", field: "stock", sort: "asc" },
            { label: "Actions", field: "actions" },
            ],
            rows: [],
                }

        data?.products?.forEach((product)=>{
            products.rows.push({
                id: product?._id,
                name: `${product?.name?.substring(0, 20)}...`,
                price: `$${product?.price}`,
                stock: product?.stock,
                actions: (
                    <>
                    <Link to={`/admin/update/${product?._id}`} className="btn btn-primary">
                    <i className='fa fa-edit'></i>
                    </Link>
                    <Link to={`/admin/product/${product?._id}/upload_images`} className="btn btn-outline-success ms-2 ">
                    <i className='fa fa-image'></i>
                    </Link>
                    <button className='btn btn-outline-danger ms-2'
                    onClick={() => deleteHandler(product?._id)} // HIGHLIGHT: Call the handler with ID
                    disabled={isDeleteLoading}>
                    <i className='fa fa-trash'></i>
                    </button>
                    </>
                )
            })
        })
        return products;
      }
 

  return ( 
    <>
    <MetaData title={'All Products'}/>
    <AdminLayout>
        <h1 className='my-5'>{data?.products?.length} Products</h1>

        <MDBDataTable 
        data={setProducts()}
        className='px-3'
        bordered striped hover/>
    </AdminLayout>
    </>
  )
}


export default ListProducts
 