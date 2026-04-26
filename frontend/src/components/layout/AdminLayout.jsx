import React from 'react'
import SideMenu from './SideMenu'

const AdminLayout = ({children}) => {
     const menuItems = [
        {
            name:"Dashboard",
            url:"/admin/dashboard",
            icon:"fas fa-tachometer-alt",
        },
        {
            name:"New Product",
            url:"/admin/product/new",
            icon:"fas fa-box-open",
        },
        {
            name:"Orders",
            url:"/admin/orders",
            icon:"fas fa-shopping-cart",
        },
        {
            name:"Products",
            url:"/admin/products",
            icon:"fas fa-boxes",
        },
        {
            name:"Users",
            url:"/admin/users",
            icon:"fas fa-users",
        },
        {
            name:"Reviews",
            url:"/admin/reviews",
            icon:"fas fa-comments",
        },
    ]
  return (
    <div>
        <div className="mt-2 mb-4 py-4">
            <h2 className="text-center fw-bolder">Admin Settings</h2>
        </div>

        <div className="container">
            <div className="row justify-content-around">
                <div className="col-12 col-lg-3">
                     <SideMenu menuItems={menuItems} />
                </div>
                <div className="col-12 col-lg-8 user-dashboard">{children}</div>
            </div>
        </div>
    </div>
  )
}

export default AdminLayout