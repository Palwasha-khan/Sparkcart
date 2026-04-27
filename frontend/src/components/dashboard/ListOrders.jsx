import React, { useEffect } from 'react';
import toast from 'react-hot-toast';
import Loader from '../layout/Loader';
import { MDBDataTable } from 'mdbreact';
import MetaData from '../layout/Metadata';
import { Link } from 'react-router-dom';
import AdminLayout from '../layout/adminLayout';
import { useDeleteOrderMutation, useGetAdminOrdersQuery,  } from '../../redux/api/orderApi'; 

const ListOrders = () => {
    // Fetch Data
    const { data, isLoading, error } = useGetAdminOrdersQuery();

    // Delete Mutation (Need to add this to your orderApi)
   const [deleteOrder, { error: deleteError, isSuccess: isDeleteSuccess, isLoading: isDeleteLoading }] = useDeleteOrderMutation();

    useEffect(() => {
        if (error) {
            toast.error(error?.data?.message || 'Failed to fetch orders');
        }

        if (deleteError) {
            toast.error(deleteError?.data?.message || 'Delete failed');
        }

        if (isDeleteSuccess) {
            toast.success("Order Deleted Successfully");}
    }, [error, deleteError, isDeleteSuccess ]);

    const deleteHandler = (id) => { 
        if (window.confirm("Are you sure you want to delete this order?")) {
            deleteOrder(id);
        }
    };

    const setOrders = () => {
        // Renamed to 'ordersTable' to avoid confusion with single 'order'
        const ordersTable = {
            columns: [
                { label: "ID", field: "id", sort: "asc" },
                { label: "Payment Status", field: "paymentStatus", sort: "asc" },
                { label: "Order Status", field: "orderStatus", sort: "asc" },
                { label: "Actions", field: "actions" },
            ],
            rows: [],
        };

        data?.orders?.forEach((order) => {
            ordersTable.rows.push({
                id: order?._id,
                paymentStatus: order?.paymentInfo?.status?.toUpperCase(),
                orderStatus: order?.orderStatus,
                actions: (
                    <>
                        <Link to={`/admin/orders/${order?._id}`} className="btn btn-primary">
                            <i className='fa fa-pencil'></i>
                        </Link>
                        <button 
                            className='btn btn-outline-danger ms-2'
                            onClick={() => deleteHandler(order?._id)}
                            disabled={isDeleteLoading}
                        >
                            <i className='fa fa-trash'></i>
                        </button>
                    </>
                )
            });
        });

        return ordersTable;
    };

    if (isLoading) return <Loader />;

    return (
        <>
            <MetaData title={'All Orders'} />
            <AdminLayout>
                <h1 className='my-5'>{data?.orders?.length} Orders</h1>

                <MDBDataTable
                    data={setOrders()}
                    className='px-3'
                    bordered
                    striped
                    hover
                />
            </AdminLayout>
        </>
    );
};

export default ListOrders;
 