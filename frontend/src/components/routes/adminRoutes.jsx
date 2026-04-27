import React from 'react'
import { Route } from 'react-router-dom';
import ProtectedRoute from '../auth/ProtectedRoute';
import Dashboard from '../dashboard/Dashboard';
import ListProducts from '../dashboard/ListProducts';
import NewProduct from '../dashboard/NewProduct';
import UpdateProduct from '../dashboard/UpdateProduct';
import UploadImages from '../dashboard/UploadImages';
import ListOrders from '../dashboard/ListOrders';
import ProcessOrder from '../dashboard/ProcessOrder';
import ListUsers from '../dashboard/ListUsers';
const adminRoutes = () => {
  return (
    <>
   <Route path="/admin/dashboard" element={
                <ProtectedRoute admin={true}><Dashboard/></ProtectedRoute>} />
      
    <Route path="/admin/products" element={
                <ProtectedRoute admin={true}><ListProducts/></ProtectedRoute>} />
    <Route path="/admin/users" element={
                <ProtectedRoute admin={true}><ListUsers/></ProtectedRoute>} />
               

    <Route path="/admin/product/new" element={
                <ProtectedRoute admin={true}><NewProduct/></ProtectedRoute>} />
   <Route path="/admin/update/:id" element={<ProtectedRoute admin={true}><UpdateProduct/></ProtectedRoute>} />
   <Route path="/admin/product/:id/upload_images" element={<ProtectedRoute admin={true}><UploadImages/></ProtectedRoute>} />
  <Route path="/admin/orders" element={<ProtectedRoute admin={true}><ListOrders/></ProtectedRoute>} />
  <Route path="/admin/orders/:id" element={<ProtectedRoute admin={true}><ProcessOrder/></ProtectedRoute>} />
  <Route path="/admin/users" element={<ProtectedRoute admin={true}><ListUsers/></ProtectedRoute>} />
    {/* <Route path="/admin/users" element={<ProtectedRoute admin={true}><UpdateUser/></ProtectedRoute>} />
    <Route path="/admin/reviews" element={<ProtectedRoute admin={true}><Reviews/></ProtectedRoute>} /> */} */
 </> 
 )
}

export default adminRoutes