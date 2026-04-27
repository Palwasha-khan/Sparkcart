import React, { useState, useEffect } from 'react';
import AdminLayout from '../layout/adminLayout';
import MetaData from '../layout/MetaData';
import Loader from '../layout/Loader';
import { MDBDataTable } from 'mdbreact';
import { Link } from 'react-router-dom';
import { useGetProductReviewsQuery, useDeleteReviewMutation } from '../../redux/api/productApi';
import { toast } from 'react-hot-toast';

const Reviews = () => {
    const [productId, setProductId] = useState("");

    const { data, isLoading, error } = useGetProductReviewsQuery(productId, {
        skip: productId === "",
    });

    const [deleteReview, { isSuccess, error: deleteError, isLoading: isDeleteLoading }] = useDeleteReviewMutation();

    useEffect(() => {
        if (error) {
            toast.error(error?.data?.message || "Product not found");
        }
        if (deleteError) {
            toast.error(deleteError?.data?.message);
        }
        if (isSuccess) {
            toast.success("Review Deleted successfully");
        }
    }, [error, deleteError, isSuccess]);

    const submitHandler = (e) => {
        e.preventDefault();
        if (productId.length !== 24) {
            toast.error("Please enter a valid 24-character Product ID");
        }
    };

    const deleteReviewHandler = (reviewId) => {
        deleteReview({ productId, id: reviewId });
    };

    // --- Table Data Setup ---
    const setReviews = () => {
        const reviewsTable = {
            columns: [
                { label: "ID", field: "id", sort: "asc" },
                { label: "Rating", field: "rating", sort: "asc" },
                { label: "Comment", field: "comment", sort: "asc" },
                { label: "User", field: "user", sort: "asc" },
                { label: "Actions", field: "actions" },
            ],
            rows: [],
        };

        data?.reviews?.forEach((review) => {
            reviewsTable.rows.push({
                id: review?._id,
                rating: review?.rating,
                comment: review?.comment,
                user: review?.user?.name || "N/A",
                actions: (
                    <>
                        <button
                            className="btn btn-outline-danger ms-2"
                            onClick={() => deleteReviewHandler(review._id)}
                            disabled={isDeleteLoading}
                        >
                            <i className="fa fa-trash"></i>
                        </button>
                    </>
                ),
            });
        });

        return reviewsTable;
    };

    return (
        <>
            <MetaData title={'Product Reviews'} />
            <AdminLayout>
                <div className="row justify-content-center my-5">
                    <div className="col-6">
                        <form onSubmit={submitHandler}>
                            <div className="mb-3">
                                <label htmlFor="productId_field" className="form-label">
                                    Enter Product ID
                                </label>
                                <input
                                    type="text"
                                    id="productId_field"
                                    className="form-control"
                                    value={productId}
                                    onChange={(e) => setProductId(e.target.value)}
                                />
                            </div>

                            <button
                                id="search_button"
                                type="submit"
                                className="btn btn-primary w-100 py-2"
                                disabled={isLoading}
                            >
                                SEARCH
                            </button>
                        </form>
                    </div>
                </div>

                {data?.reviews?.length > 0 ? (
                    <MDBDataTable
                        data={setReviews()}
                        className="px-3"
                        bordered
                        striped
                        hover
                    />
                ) : (
                    !isLoading && productId !== "" && (
                        <p className="mt-5 text-center">No reviews found for this Product ID.</p>
                    )
                )}
            </AdminLayout>
        </>
    );
};

export default Reviews;