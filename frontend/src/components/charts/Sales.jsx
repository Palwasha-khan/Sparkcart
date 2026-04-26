
import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// 1. Register the components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);


const Sales = ({ data: salesData }) => { 
    const labels = salesData?.map((item) => item.date) || [];
    const salesValues = salesData?.map((item) => item.sales) || [];
    const orderValues = salesData?.map((item) => item.orders) || [];
    const data = {
    labels,
    datasets: [
      {
        label: 'Sales ($)',
        data: salesValues,
        borderColor: '#198753',
        backgroundColor: 'rgba(73, 185, 135, 0.5)',
        yAxisID: 'y', // Link to the left axis
      },
      {
        label: 'Orders',
        data: orderValues,
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        yAxisID: 'y1', // Link to the right axis
      },
    ],
  };
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    scales: {
      y: {
        type: 'linear',
        display: true,
        position: 'left',
        title: {
          display: true,
          text: 'Sales Amount ($)'
        }
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        grid: {
          drawOnChartArea: false, // Prevents grid lines from overlapping
        },
        title: {
          display: true,
          text: 'Number of Orders'
        }
      },
    },
  };

  return (
    <div style={{ height: "460px", width: "100%" }}>
        <Line data={data} options={options}/>
    </div>
  )
}

export default Sales
 