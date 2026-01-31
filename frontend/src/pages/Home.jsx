import MetaData from "../components/layout/Metadata"
import { useGetProductsQuery } from '../redux/api/productApi'
import ProductItem from "../components/product/ProductItem"
import Loader from "../components/layout/Loader"

import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import CustomPagination from '../components/layout/CustomPagination'
import { useSearchParams } from "react-router-dom"
import Filter from "../components/layout/Filter"

const Home = () => {

  const [searchParams] = useSearchParams()

const page = Number(searchParams.get('page')) || 1
const keyword = searchParams.get('keyword') || ''
const min = Number(searchParams.get('price[gte]')) || 0
const max = Number(searchParams.get('price[lte]')) || 0
const category = searchParams.get('category') || ''


const params = { page, keyword, min, max,category }


  const { data, isLoading, error, isError } =
    useGetProductsQuery(params)

    useEffect(() => {
    if (isError) {
      toast.error(error?.data?.message || 'Something went wrong')
    }
  }, [isError])

  if (isLoading) return  <Loader/>
 

  return (
    <>
     <MetaData title="Buy Best Products Online" />
    <div className="container">
      <div className="row">
        {keyword && (
      <div className="col-12 col-md-3 mt-5">
        <Filter />
      </div>
    )}
        <div className={keyword? "col-6  col-md-9":"col-6 col-sm-6 col-md-12"}>
          <h1 id="products_heading" className="text-secondary">
           {keyword ? `${data?.products?.length} product found with Keyword : ${keyword} `: "Latest Products" }
           
          </h1>
 
          <section id="products" className="mt-5">
            <div className="row"> 
              {data?.products?.map((product) => (
                <ProductItem key={product._id} product={product}/>
              ))}
            </div>
          </section>
        
       <CustomPagination
        resPerPage={data?.resPerPage}
        filteredProductsCount={data?.filterProductscount}
      />
        </div>
      </div>
    </div>
    </>
  )
}

export default Home
 