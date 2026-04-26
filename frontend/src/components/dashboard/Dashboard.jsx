 import AdminLayout from '../layout/adminLayout'
import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import Sales from '../charts/Sales';
import "react-datepicker/dist/react-datepicker.css";
import { useLazyGetDashboardDataQuery } from '../../redux/api/orderApi';
 import Loader from '../layout/Loader';
import { toast } from 'react-toastify';
import MetaData from '../layout/Metadata';

const Dashboard = () => {
  const [startDate, setStartDate] = useState(new Date().setDate(1));
  const [endDate, setEndDate] = useState(new Date());
  const [getDashboardData, {error,isLoading, data: dashboardData }] = useLazyGetDashboardDataQuery();

  useEffect(() => {
    if(error){
       toast.error(error?.data?.message || "Failed to fetch dashboard data")
    }
    if(startDate && endDate && !dashboardData){
      getDashboardData({
        startDate: new Date(startDate).toISOString(),
        endDate: new Date(endDate).toISOString()
      });
    }
  }, [error, getDashboardData, dashboardData, startDate, endDate]);

  const submitHandler = (e) => {
    e.preventDefault();
     
    getDashboardData({
      startDate: new Date(startDate).toISOString(), 
      endDate: new Date(endDate).toISOString()})
  } 
   if(isLoading) return <Loader />

  return (<>
    <MetaData title={'Admin Dashboard'}/>
    <AdminLayout>
        <div className="d-flex justify-content-start align-items-center">
      <div className="mb-3 me-4">
        <label className="form-label d-block">Start Date</label>
        <DatePicker selected={startDate} onChange={(date) => setStartDate(date)} 
        startDate={startDate} endDate={endDate} 
        className="form-control"/>
      </div>
      <div className="mb-3">
        <label className="form-label d-block">End Date</label>
        <DatePicker selected={endDate} onChange={(date) => setEndDate(date)} 
        minDate={startDate} endDate={endDate} 
        className="form-control" />
      </div>
      <button className="btn fetch-btn ms-4 mt-3 px-5" onClick={submitHandler}>Fetch</button>
    </div>

    <div className="row pr-4 my-5">
      <div className="col-xl-6 col-sm-12 mb-3">
        <div className="card text-white bg-success o-hidden h-100">
          <div className="card-body">
            <div className="text-center card-font-size">
              Sales
              <br />
              <b>$ {dashboardData?.totalSales?.toFixed(2) || 0.00}</b>
            </div>
          </div>
        </div>
      </div>

      <div className="col-xl-6 col-sm-12 mb-3">
        <div className="card text-white bg-danger o-hidden h-100">
          <div className="card-body">
            <div className="text-center card-font-size">
              Orders
              <br />
              <b>{dashboardData?.totalNumOrders || 0}</b>
            </div>
          </div>
        </div>
      </div>
    </div>

    <Sales data={dashboardData?.sales || []} /> 

    <div className="mb-5"></div>
    </AdminLayout>
    </>
  )
}

export default Dashboard