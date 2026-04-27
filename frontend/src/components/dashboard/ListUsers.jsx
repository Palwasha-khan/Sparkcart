import React, { useEffect } from 'react';
import toast from 'react-hot-toast';
import Loader from '../layout/Loader';
import { MDBDataTable } from 'mdbreact';
import MetaData from '../layout/Metadata';
import { Link } from 'react-router-dom';
import AdminLayout from '../layout/adminLayout';
import { useDeleteUserMutation, useGetAdminUsersQuery } from '../../redux/api/userApi';
const ListUsers = () => {
    // Fetch Data
    const { data, isLoading, error } = useGetAdminUsersQuery();

    // Delete Mutation (Need to add this to your orderApi)
   const [deleteUser, { error: deleteError, isSuccess: isDeleteSuccess, isLoading: isDeleteLoading }] = useDeleteUserMutation();

    useEffect(() => {
        if (error) {
            toast.error(error?.data?.message || 'Failed to fetch users');
        }

        if (deleteError) {
            toast.error(deleteError?.data?.message || 'Delete failed');
        }

        if (isDeleteSuccess) {
            toast.success("Order Deleted Successfully");}
    }, [error ]);

    const deleteHandler = (id) => { 
        if (window.confirm("Are you sure you want to delete this user?")) {
            deleteUser(id);
        }
    };

    const setusers = () => {
        // Renamed to 'ordersTable' to avoid confusion with single 'order'
        const usersTable = {
            columns: [
                { label: "ID", field: "id", sort: "asc" },
                { label: "Name", field: "name", sort: "asc" },
                { label: "Email", field: "email", sort: "asc" },
                { label: "Actions", field: "actions" },
            ],
            rows: [],
        };

        data?.users?.forEach((user) => {
            usersTable.rows.push({
                id: user?._id,
                name: user?.name,
                email: user?.email, 
                actions: (
                    <>
                        <Link to={`/admin/users/${user?._id}`} className="btn btn-primary">
                            <i className='fa fa-pencil'></i>
                        </Link>
                        <button 
                            className='btn btn-outline-danger ms-2'
                            onClick={() => deleteHandler(user?._id)}
                            disabled={isDeleteLoading}
                        >
                            <i className='fa fa-trash'></i>
                        </button>
                    </>
                )
            });
        });

        return usersTable;
    };

    if (isLoading) return <Loader />;

    return (
        <>
            <MetaData title={'All Users'} />
            <AdminLayout>
                <h1 className='my-5'>{data?.users?.length} Users</h1>

                <MDBDataTable
                    data={setusers()}
                    className='px-3'
                    bordered
                    striped
                    hover
                />
            </AdminLayout>
        </>
    );
};

export default ListUsers;
 